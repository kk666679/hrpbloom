import { AgentTask, AgentResponse, AgentConfig, AgentContext, ConversationMessage } from '../types/ai-agents';
import { generateStructuredCompletion } from './openai-client';

export abstract class AIBaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig | string) {
    if (typeof config === 'string') {
      this.config = {
        name: config,
        type: 'COORDINATOR' as any,
        capabilities: [],
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: '',
        isActive: true,
        priority: 1
      };
    } else {
      this.config = config;
    }
  }

  /**
   * Get the name of the agent.
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Process a given task and return a response.
   * Must be implemented by subclasses.
   * @param task AgentTask to process
   * @param context optional context
   */
  abstract processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse>;

  /**
   * Log messages or events related to the agent.
   * @param message string message to log
   */
  protected log(message: string): void {
    console.log(`[${this.config.name}] ${message}`);
  }

  /**
   * Generate structured response using AI
   */
  protected async generateStructuredResponse(
    messages: ConversationMessage[],
    schema: any,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<any> {
    return await generateStructuredCompletion(
      messages,
      schema,
      {
        model: this.config.model as any,
        temperature: options.temperature ?? this.config.temperature,
        maxTokens: options.maxTokens ?? this.config.maxTokens,
        systemPrompt: this.config.systemPrompt,
      }
    );
  }
}
