import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const wedding = new OpenAPIHono();

// Path to wedding configuration
const configPath = join(process.cwd(), 'server', 'data', 'wedding.json');

// Zod schemas for reusability and type safety
const WeddingCoupleSchema = z.object({
  bride: z.string(),
  groom: z.string(),
});

const CountdownLabelsSchema = z.object({
  days: z.string(),
  hours: z.string(),
  minutes: z.string(),
  seconds: z.string(),
});

const WeddingDetailsSchema = z.object({
  date: z.string().datetime(),
  venue: z.string(),
  timezone: z.string(),
  title: z.string(),
  couple: WeddingCoupleSchema,
});

const CountdownConfigSchema = z.object({
  completedMessage: z.string(),
  labels: CountdownLabelsSchema,
});

const SettingsSchema = z.object({
  allowUpdates: z.boolean(),
  lastUpdated: z.string().datetime(),
});

const WeddingConfigSchema = z.object({
  wedding: WeddingDetailsSchema,
  countdown: CountdownConfigSchema,
  settings: SettingsSchema,
});

// Enhanced response schema that includes computed countdown data
const WeddingResponseSchema = z.object({
  // Wedding details
  date: z.string().datetime(),
  venue: z.string(),
  timezone: z.string(),
  title: z.string(),
  couple: WeddingCoupleSchema,
  
  // Computed countdown data
  dateTimestamp: z.number(),
  currentTime: z.string().datetime(),
  currentTimestamp: z.number(),
  timeRemaining: z.number().min(0),
  isComplete: z.boolean(),
  completedMessage: z.string(),
  labels: CountdownLabelsSchema,
  
  // Metadata
  allowUpdates: z.boolean(),
  lastUpdated: z.string().datetime(),
});

const DateResponseSchema = z.object({
  date: z.string().datetime(),
  dateTimestamp: z.number(),
  timezone: z.string(),
  timeRemaining: z.number().min(0),
  isComplete: z.boolean(),
});

const DateUpdateRequestSchema = z.object({
  date: z.string().datetime().describe('ISO datetime string for the wedding date'),
  timezone: z.string().optional().describe('Timezone for the wedding (optional)'),
});

const DateUpdateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  previousDate: z.string(),
  newDate: z.string(),
  timezone: z.string().optional(),
});

const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.string().optional(),
});

// Interface for wedding configuration (derived from Zod schema)
type WeddingConfig = z.infer<typeof WeddingConfigSchema>;

// Custom error classes for better error handling
class ConfigurationError extends Error {
  constructor(message: string, public code: string = 'CONFIG_ERROR') {
    super(message);
    this.name = 'ConfigurationError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper function to read wedding config
async function readWeddingConfig(): Promise<WeddingConfig> {
  try {
    const data = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(data);
    return WeddingConfigSchema.parse(parsed);
  } catch (error) {
    console.error('Error reading wedding config:', error);
    if (error instanceof z.ZodError) {
      throw new ConfigurationError('Invalid wedding configuration format');
    }
    throw new ConfigurationError('Failed to load wedding configuration');
  }
}

// Helper function to write wedding config
async function writeWeddingConfig(config: WeddingConfig): Promise<void> {
  try {
    // Validate before writing
    const validatedConfig = WeddingConfigSchema.parse({
      ...config,
      settings: {
        ...config.settings,
        lastUpdated: new Date().toISOString(),
      },
    });
    
    await writeFile(configPath, JSON.stringify(validatedConfig, null, 2));
  } catch (error) {
    console.error('Error writing wedding config:', error);
    if (error instanceof z.ZodError) {
      throw new ConfigurationError('Invalid configuration data');
    }
    throw new ConfigurationError('Failed to save wedding configuration');
  }
}

// Helper function to compute countdown data
function computeCountdownData(config: WeddingConfig) {
  const weddingDate = new Date(config.wedding.date);
  const now = new Date();
  const timeDifference = weddingDate.getTime() - now.getTime();
  
  return {
    dateTimestamp: weddingDate.getTime(),
    currentTime: now.toISOString(),
    currentTimestamp: now.getTime(),
    timeRemaining: Math.max(0, timeDifference),
    isComplete: timeDifference <= 0,
  };
}

// GET /api/wedding - Get complete wedding details with countdown data
const getWeddingRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Wedding'],
  summary: 'Get wedding details and countdown',
  description: 'Returns complete wedding information including computed countdown data',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: WeddingResponseSchema,
        },
      },
      description: 'Wedding details and countdown data retrieved successfully',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal server error',
    },
  },
});

wedding.openapi(getWeddingRoute, async (c) => {
  try {
    const config = await readWeddingConfig();
    const countdownData = computeCountdownData(config);
    
    const response = {
      // Wedding details
      date: config.wedding.date,
      venue: config.wedding.venue,
      timezone: config.wedding.timezone,
      title: config.wedding.title,
      couple: config.wedding.couple,
      
      // Computed countdown data
      ...countdownData,
      completedMessage: config.countdown.completedMessage,
      labels: config.countdown.labels,
      
      // Metadata
      allowUpdates: config.settings.allowUpdates,
      lastUpdated: config.settings.lastUpdated,
    };
    
    return c.json(response);
  } catch (error) {
    console.error('Error retrieving wedding data:', error);
    
    if (error instanceof ConfigurationError) {
      return c.json({ 
        error: error.message, 
        code: error.code 
      }, 500);
    }
    
    return c.json({ 
      error: 'Failed to retrieve wedding data',
      code: 'INTERNAL_ERROR'
    }, 500);
  }
});

// GET /api/wedding/date - Get just the wedding date with countdown info
const getDateRoute = createRoute({
  method: 'get',
  path: '/date',
  tags: ['Wedding'],
  summary: 'Get wedding date',
  description: 'Returns only the wedding date and related countdown information',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DateResponseSchema,
        },
      },
      description: 'Wedding date retrieved successfully',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal server error',
    },
  },
});

wedding.openapi(getDateRoute, async (c) => {
  try {
    const config = await readWeddingConfig();
    const countdownData = computeCountdownData(config);
    
    const response = {
      date: config.wedding.date,
      timezone: config.wedding.timezone,
      ...countdownData,
    };
    
    return c.json(response);
  } catch (error) {
    console.error('Error retrieving wedding date:', error);
    
    if (error instanceof ConfigurationError) {
      return c.json({ 
        error: error.message, 
        code: error.code 
      }, 500);
    }
    
    return c.json({ 
      error: 'Failed to retrieve wedding date',
      code: 'INTERNAL_ERROR'
    }, 500);
  }
});


// PATCH /api/wedding/date - Partial update of wedding date (alias for PUT in this case)
const patchDateRoute = createRoute({
  method: 'patch',
  path: '/date',
  tags: ['Wedding'],
  summary: 'Partially update wedding date',
  description: 'Updates the wedding date and optionally the timezone (same as PUT for this resource)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: DateUpdateRequestSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DateUpdateResponseSchema,
        },
      },
      description: 'Wedding date updated successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Bad request - no valid fields provided',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Forbidden - updates not allowed',
    },
    422: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unprocessable entity - invalid date format',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Internal server error',
    },
  },
});

wedding.openapi(patchDateRoute, async (c) => {
  try {
    const config = await readWeddingConfig();
    
    if (!config.settings.allowUpdates) {
      return c.json({ 
        error: 'Wedding updates are currently disabled',
        code: 'UPDATES_DISABLED'
      }, 403);
    }

    const updateData = await c.req.json();
    const { date, timezone } = updateData;

    // Check if any valid fields are provided
    if (!date && !timezone) {
      return c.json({ 
        error: 'At least one field (date or timezone) must be provided',
        code: 'NO_UPDATE_FIELDS'
      }, 400);
    }

    const previousDate = config.wedding.date;
    const previousTimezone = config.wedding.timezone;
    
    // Update date if provided
    if (date) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return c.json({ 
          error: 'Invalid date format. Please provide a valid ISO datetime string.',
          code: 'INVALID_DATE_FORMAT'
        }, 422);
      }
      config.wedding.date = newDate.toISOString();
    }
    
    // Update timezone if provided
    if (timezone) {
      config.wedding.timezone = timezone;
    }

    await writeWeddingConfig(config);

    return c.json({ 
      success: true,
      message: `Wedding ${date ? 'date' : ''}${date && timezone ? ' and ' : ''}${timezone ? 'timezone' : ''} updated successfully`,
      previousDate,
      newDate: config.wedding.date,
      ...(timezone && { timezone })
    });

  } catch (error) {
    console.error('Error updating wedding date:', error);
    
    if (error instanceof ConfigurationError) {
      return c.json({ 
        error: error.message, 
        code: error.code 
      }, 500);
    }
    
    return c.json({ 
      error: 'Failed to update wedding date',
      code: 'INTERNAL_ERROR'
    }, 500);
  }
});

export default wedding;
