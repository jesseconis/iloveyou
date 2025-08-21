import { Hono } from 'hono';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const countdown = new Hono();

// Path to wedding configuration
const configPath = join(process.cwd(), 'server', 'data', 'wedding.json');

// Interface for wedding configuration
interface WeddingConfig {
  wedding: {
    date: string;
    venue: string;
    timezone: string;
    title: string;
    couple: {
      bride: string;
      groom: string;
    };
  };
  countdown: {
    completedMessage: string;
    labels: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
  settings: {
    allowUpdates: boolean;
    lastUpdated: string;
  };
}

// Helper function to read wedding config
async function readWeddingConfig(): Promise<WeddingConfig> {
  try {
    const data = await readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading wedding config:', error);
    throw new Error('Failed to load wedding configuration');
  }
}

// Helper function to write wedding config
async function writeWeddingConfig(config: WeddingConfig): Promise<void> {
  try {
    config.settings.lastUpdated = new Date().toISOString();
    await writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error writing wedding config:', error);
    throw new Error('Failed to save wedding configuration');
  }
}

// GET /api/countdown - Get current wedding countdown data
countdown.get('/', async (c) => {
  try {
    const config = await readWeddingConfig();
    
    const weddingDate = new Date(config.wedding.date);
    const now = new Date();
    const timeDifference = weddingDate.getTime() - now.getTime();
    
    const response = {
      weddingDate: config.wedding.date,
      weddingDateTimestamp: weddingDate.getTime(),
      currentTime: now.toISOString(),
      currentTimestamp: now.getTime(),
      timeRemaining: Math.max(0, timeDifference),
      isComplete: timeDifference <= 0,
      title: config.wedding.title,
      venue: config.wedding.venue,
      completedMessage: config.countdown.completedMessage,
      labels: config.countdown.labels,
      couple: config.wedding.couple
    };

    return c.json(response);
  } catch (error) {
    console.error('Error in countdown GET:', error);
    return c.json({ error: 'Failed to fetch countdown data' }, 500);
  }
});

// POST /api/countdown/update-date - Update wedding date (if updates allowed)
countdown.post('/update-date', async (c) => {
  try {
    const config = await readWeddingConfig();
    
    if (!config.settings.allowUpdates) {
      return c.json({ error: 'Updates are not allowed' }, 403);
    }

    const body = await c.req.json();
    const { date, timezone } = body;

    if (!date) {
      return c.json({ error: 'Date is required' }, 400);
    }

    // Validate date format
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      return c.json({ error: 'Invalid date format' }, 400);
    }

    // Update configuration
    config.wedding.date = newDate.toISOString();
    if (timezone) {
      config.wedding.timezone = timezone;
    }

    await writeWeddingConfig(config);

    return c.json({ 
      success: true, 
      newDate: config.wedding.date,
      message: 'Wedding date updated successfully' 
    });
  } catch (error) {
    console.error('Error in countdown POST:', error);
    return c.json({ error: 'Failed to update wedding date' }, 500);
  }
});

// GET /api/countdown/config - Get full wedding configuration
countdown.get('/config', async (c) => {
  try {
    const config = await readWeddingConfig();
    return c.json(config);
  } catch (error) {
    console.error('Error in config GET:', error);
    return c.json({ error: 'Failed to fetch configuration' }, 500);
  }
});

export default countdown;
