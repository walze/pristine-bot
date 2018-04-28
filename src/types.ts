import { Message } from "discord.js";

declare global {
  type DiscordAction = (msg: Message) => void
}
