import { ScreenMonitor } from './screen-monitor';

async function testMonitor() {
    console.log('🚀 Starting monitor test...');
    
    // Create monitor instance
    const monitor = new ScreenMonitor();
    
    // Test for 30 seconds
    console.log('⏳ Testing for 30 seconds...');
    console.log('Try the following to test different detection methods:');
    console.log('1. Open a browser window with "bank" in the title');
    console.log('2. Copy some sensitive text (like "password123") to clipboard');
    console.log('3. Open a remote desktop application');
    console.log('4. Check the screenshots folder for captured images');
    
    // Wait for 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Stop monitoring
    monitor.stopMonitoring();
    console.log('✅ Test completed');
}

// Run the test
testMonitor().catch(console.error); 