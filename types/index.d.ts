interface Option {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  required: boolean;
}

interface Command {
  name: string;
  description: string;
  callback: (interaction: CommandInteraction) => void;
  options?: Option[];
  permissions?: bigint;
}

interface IEvent {
  event: Events;
  once: boolean;
  callback: (event: Interaction, listener: (...args: any) => void) => void;
}
