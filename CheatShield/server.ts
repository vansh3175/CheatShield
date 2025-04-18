
import { DesktopUseClient, ApiError } from 'desktop-use';

const client = new DesktopUseClient(); // Connects to default 127.0.0.1:3000
// const client = new DesktopUseClient('127.0.0.1:3001'); // Or specify host:port

async function launchApps() {
    try {
      // open windows calculator
      console.log('opening calculator...');
      await client.openApplication('calc');
      console.log('calculator opened.');
  
    //   // wait a bit for the app to load (optional)
    //   await sleep(1000);
  
    //   // open notepad
    //   console.log('opening notepad...');
    //   await client.openApplication('notepad');
    //   console.log('notepad opened.');
  
    //   // open a url
    //   console.log('opening url...');
    //   await client.openUrl('https://github.com/mediar-ai/terminator');
    //   console.log('url opened.');
  
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`api error (${error.status}): ${error.message}`);
      } else {        console.error('an unexpected error occurred:', error);
      }
    }
  }
  
  launchApps();
  
  // Utility function for delays
  function sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }