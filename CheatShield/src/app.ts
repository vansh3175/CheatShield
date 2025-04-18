import express from 'express';
import { ScreenMonitor } from './screen-monitor';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize screen monitor
const screenMonitor = new ScreenMonitor();

// Log all incoming requests
app.use((req, res, next) => {
  console.log('\n🔄 === Incoming Request ===');
  console.log(`📍 URL: ${req.url}`);
  console.log(`📝 Method: ${req.method}`);
  console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📄 Body:', JSON.stringify(req.body, null, 2));
  console.log('=== End Request Info ===\n');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'Screen Text Monitor',
    version: '1.0.0'
  });
});

// Test endpoint to simulate screen capture events
app.post('/test-capture', (req, res) => {
  console.log('Test capture endpoint called');
  res.json({ status: 'success', message: 'Test capture received' });
});

// Start the server
app.listen(port, () => {
  console.log('\n=== Screen Monitor Server ===');
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log('📺 Screen monitoring is active');
  console.log('Press Ctrl+C to stop monitoring');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping monitoring...');
  screenMonitor.stopMonitoring();
  process.exit(0);
});
