import { Message } from "discord.js";
import Command from "./classes/Command";

declare global {
  type DiscordAction = (msg: Message, reference: Command) => void
}
