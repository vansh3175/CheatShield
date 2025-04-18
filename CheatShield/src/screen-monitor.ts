import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { createWorker } from 'tesseract.js';
const robot = require('robotjs');
const notifier = require('node-notifier');

const execAsync = promisify(exec);

interface ExamAlert {
  timestamp: string;
  type: 'ai_tool' | 'search_engine' | 'messaging' | 'study_material' | 'tab_switch' | 'copy_paste' | 'multiple_windows' | 'suspicious_activity' | 'virtual_machine' | 'remote_desktop' | 'screen_recording' | 'keyboard_shortcut' | 'time_analysis';
  riskScore: number;
  details: string;
  windowTitle?: string;
  extractedText?: string;
}

export class ScreenMonitor {
  private interval: NodeJS.Timeout | null = null;
  private worker: any = null;
  private tempDir: string;
  private previousWindowTitle: string = '';
  private riskScore: number = 0;
  private lastAlertTime: Date | null = null;
  private alertCooldown: number = 30000; // 30 seconds cooldown between alerts
  private logsDir: string;
  private bannedKeywords: string[];
  private tabSwitchCount: number = 0;
  private lastTabSwitchTime: number = 0;
  private copyPasteCount: number = 0;
  private lastCopyPasteTime: number = 0;
  private windowCount: number = 0;
  private lastWindowCheck: number = 0;
  private alerts: ExamAlert[] = [];
  private lastActivityTime: number = 0;
  private inactivityCount: number = 0;
  private clipboardHistory: string[] = [];
  private keyboardShortcuts: Map<string, number> = new Map();
  private suspiciousProcesses: string[] = [
    'vmware', 'virtualbox', 'vbox', 'teamviewer', 'anydesk', 
    'obs', 'camtasia', 'screencast', 'bandicam', 'fraps'
  ];
  private lastNotificationTime: number = 0;
  private notificationCooldown: number = 60000; // 1 minute cooldown

  private trustedDomains = [
    'examportal.com',
    'university.edu',
    'learningplatform.com'
  ];

  constructor() {
    console.log('🎓 ExamGuard initialized');
    this.tempDir = path.join(process.cwd(), 'temp');
    this.logsDir = path.join(process.cwd(), 'logs');
    
    // Create necessary directories
    [this.tempDir, this.logsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    this.bannedKeywords = [
      'chatgpt', 'gpt', 'ai', 'chegg', 'coursehero', 'quizlet',
      'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com',
      'whatsapp', 'telegram', 'discord', 'slack', 'messenger',
      'cheat', 'copy', 'paste'
    ];

    this.initializeOCR();
    this.startMonitoring();
  }

  private async analyzeText(text: string, windowTitle: string): Promise<void> {
    const timestamp = new Date().toISOString();
    let riskScore = 0;
    let alertType: ExamAlert['type'] | null = null;
    let details = '';

    // Check for AI tools
    if (text.toLowerCase().includes('chatgpt') || text.toLowerCase().includes('gpt')) {
      riskScore += 100;
      alertType = 'ai_tool';
      details = 'AI tool detected';
    }

    // Check for search engines
    if (text.toLowerCase().includes('google.com') || 
        text.toLowerCase().includes('bing.com') || 
        text.toLowerCase().includes('yahoo.com')) {
      riskScore += 80;
      alertType = 'search_engine';
      details = 'Search engine detected';
    }

    // Check for messaging apps
    if (text.toLowerCase().includes('whatsapp') || 
        text.toLowerCase().includes('telegram') || 
        text.toLowerCase().includes('discord')) {
      riskScore += 90;
      alertType = 'messaging';
      details = 'Messaging application detected';
    }

    // Check for study materials
    if (text.toLowerCase().includes('chegg') || 
        text.toLowerCase().includes('coursehero') || 
        text.toLowerCase().includes('quizlet')) {
      riskScore += 70;
      alertType = 'study_material';
      details = 'Study material website detected';
    }

    // Check for tab switching
    if (windowTitle !== this.previousWindowTitle) {
      const now = Date.now();
      if (now - this.lastTabSwitchTime < 10000) { // Multiple tab switches within 10 seconds
        this.tabSwitchCount++;
        if (this.tabSwitchCount >= 3) {
          riskScore += 60;
          alertType = 'tab_switch';
          details = `Multiple tab switches detected (${this.tabSwitchCount} times)`;
        }
      } else {
        this.tabSwitchCount = 1;
      }
      this.lastTabSwitchTime = now;
      this.previousWindowTitle = windowTitle;
    }

    // Check for copy-paste activity
    if (text.toLowerCase().includes('copy') || text.toLowerCase().includes('paste')) {
      const now = Date.now();
      if (now - this.lastCopyPasteTime < 5000) { // Multiple copy-paste within 5 seconds
        this.copyPasteCount++;
        if (this.copyPasteCount >= 2) {
          riskScore += 50;
          alertType = 'copy_paste';
          details = `Multiple copy-paste operations detected (${this.copyPasteCount} times)`;
        }
      } else {
        this.copyPasteCount = 1;
      }
      this.lastCopyPasteTime = now;
    }

    // Check for multiple windows
    const now = Date.now();
    if (now - this.lastWindowCheck < 5000) { // Check window count every 5 seconds
      const currentWindowCount = await this.getWindowCount();
      if (currentWindowCount > this.windowCount && currentWindowCount > 3) {
        riskScore += 40;
        alertType = 'multiple_windows';
        details = `Multiple windows detected (${currentWindowCount} windows)`;
      }
      this.windowCount = currentWindowCount;
    }
    this.lastWindowCheck = now;

    // Check for suspicious processes
    const runningProcesses = await this.getRunningProcesses();
    const suspiciousProcesses = runningProcesses.filter(process => 
      this.suspiciousProcesses.some(sp => process.toLowerCase().includes(sp))
    );

    if (suspiciousProcesses.length > 0) {
      if (suspiciousProcesses.some(p => p.includes('vmware') || p.includes('virtualbox'))) {
        riskScore += 100;
        alertType = 'virtual_machine';
        details = `Virtual machine detected: ${suspiciousProcesses.join(', ')}`;
      } else if (suspiciousProcesses.some(p => p.includes('teamviewer') || p.includes('anydesk'))) {
        riskScore += 90;
        alertType = 'remote_desktop';
        details = `Remote desktop software detected: ${suspiciousProcesses.join(', ')}`;
      } else if (suspiciousProcesses.some(p => p.includes('obs') || p.includes('camtasia'))) {
        riskScore += 80;
        alertType = 'screen_recording';
        details = `Screen recording software detected: ${suspiciousProcesses.join(', ')}`;
      }
    }

    // Check for keyboard shortcuts
    const shortcuts = await this.getKeyboardShortcuts();
    shortcuts.forEach(shortcut => {
      const count = (this.keyboardShortcuts.get(shortcut) || 0) + 1;
      this.keyboardShortcuts.set(shortcut, count);
      if (count > 5) { // More than 5 uses of the same shortcut
        riskScore += 30;
        alertType = 'keyboard_shortcut';
        details = `Suspicious keyboard shortcut usage: ${shortcut} (${count} times)`;
      }
    });

    // Time-based analysis
    const currentTime = Date.now();
    if (currentTime - this.lastActivityTime > 300000) { // 5 minutes of inactivity
      this.inactivityCount++;
      if (this.inactivityCount >= 2) { // Multiple periods of inactivity
        riskScore += 40;
        alertType = 'time_analysis';
        details = `Multiple periods of inactivity detected (${this.inactivityCount} times)`;
      }
    } else {
      this.inactivityCount = 0;
    }
    this.lastActivityTime = currentTime;

    // Check for suspicious keywords
    const suspiciousKeywords = this.bannedKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    if (suspiciousKeywords.length > 0) {
      riskScore += suspiciousKeywords.length * 20;
      alertType = 'suspicious_activity';
      details = `Suspicious keywords detected: ${suspiciousKeywords.join(', ')}`;
    }

    if (riskScore > 0 && alertType) {
      const alert: ExamAlert = {
        timestamp,
        type: alertType,
        riskScore,
        details,
        windowTitle,
        extractedText: text
      };
      this.alerts.push(alert);
      this.sendAlert(alert);
    }
  }

  private async getWindowCount(): Promise<number> {
    try {
      const { stdout } = await exec('powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne \"\"} | Measure-Object | Select-Object -ExpandProperty Count"');
      if (stdout) {
        const count = parseInt(stdout.toString().trim(), 10);
        return isNaN(count) ? 0 : count;
      }
      return 0;
    } catch (error) {
      console.error('Error getting window count:', error);
      return 0;
    }
  }

  private async getRunningProcesses(): Promise<string[]> {
    try {
      const { stdout } = await exec('powershell -Command "Get-Process | Select-Object -ExpandProperty ProcessName"');
      if (stdout) {
        return stdout.toString().trim().split('\n');
      }
      return [];
    } catch (error) {
      console.error('Error getting running processes:', error);
      return [];
    }
  }

  private async getKeyboardShortcuts(): Promise<string[]> {
    try {
      const { stdout } = await exec('powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne \"\"} | Select-Object -ExpandProperty MainWindowTitle"');
      if (stdout) {
        return stdout.toString().trim().split('\n');
      }
      return [];
    } catch (error) {
      console.error('Error getting keyboard shortcuts:', error);
      return [];
    }
  }

  private async sendAlert(alert: ExamAlert): Promise<void> {
    const currentTime = Date.now();
    
    // Check if we're in cooldown period
    if (currentTime - this.lastNotificationTime < this.notificationCooldown) {
      console.log('Alert suppressed due to cooldown period');
      return;
    }

    const logMessage = `[${alert.timestamp}] ${alert.type.toUpperCase()} - Risk Score: ${alert.riskScore}\nDetails: ${alert.details}\nWindow: ${alert.windowTitle}\n`;
    
    // Log to file
    fs.appendFileSync(path.join(this.logsDir, 'exam_log.txt'), logMessage);
    
    // Send desktop notification
    notifier.notify({
      title: 'ExamGuard Alert',
      message: `${alert.details}\nRisk Score: ${alert.riskScore}`,
      sound: true,
      wait: true
    });

    // Log to console
    console.log('\x1b[31m%s\x1b[0m', 'ALERT:', logMessage);

    // Update last notification time
    this.lastNotificationTime = currentTime;
  }

  private async captureAndProcessScreen() {
    let screenshotPath = '';
    
    try {
      screenshotPath = path.join(this.tempDir, `screenshot_${Date.now()}.png`);
      
      // Create a PowerShell command with proper path escaping
      const psCommand = `
        Add-Type -AssemblyName System.Windows.Forms;
        Add-Type -AssemblyName System.Drawing;
        $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds;
        $bitmap = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height);
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap);
        $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size);
        $bitmap.Save('${screenshotPath.replace(/\\/g, '\\\\')}');
        $graphics.Dispose();
        $bitmap.Dispose()
      `.trim().replace(/\n/g, '; ');

      // Execute the PowerShell command
      await execAsync(`powershell -Command "${psCommand}"`);

      // Process with OCR
      if (this.worker && fs.existsSync(screenshotPath)) {
        const { data: { text } } = await this.worker.recognize(screenshotPath);
        
        // Analyze text for cheating
        await this.analyzeText(text, this.previousWindowTitle);

        // Display the extracted text in a formatted way
        if (text.trim()) {
          console.log('\n=== Screen Text ===');
          console.log('Time:', new Date().toLocaleTimeString());
          console.log('Risk Score:', this.riskScore);
          console.log('------------------------');
          console.log(text.trim());
          console.log('------------------------\n');
        }
      }
    } catch (error) {
      console.error('Error in screen capture and processing:', error);
    } finally {
      // Clean up screenshot file
      try {
        if (screenshotPath && fs.existsSync(screenshotPath)) {
          fs.unlinkSync(screenshotPath);
        }
      } catch (err) {
        console.error('Error cleaning up temporary files:', err);
      }
    }
  }

  private async initializeOCR() {
    try {
      this.worker = await createWorker('eng');
      console.log('OCR worker initialized');
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
    }
  }

  private async startMonitoring() {
    console.log('🔄 Starting exam monitoring (every 5 seconds)...');
    console.log('📝 Logs will be saved to:', this.logsDir);
    
    this.interval = setInterval(async () => {
      try {
        await this.captureAndProcessScreen();
      } catch (error) {
        console.error('Error during screen capture:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  public async stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.worker) {
      await this.worker.terminate();
    }
    console.log('Monitoring stopped');
    console.log('Final Risk Score:', this.riskScore);
  }
} 