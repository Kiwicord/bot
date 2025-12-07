interface Option {
  name: string;
  description: string;
  type: string;
  required: boolean;
}

interface Command {
  name: string;
  description: string;
  callback: (interaction: CommandInteraction) => void;
  options?: Option[];
}