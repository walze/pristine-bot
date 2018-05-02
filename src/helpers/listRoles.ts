import log from "./logger";
import { Client } from "discord.js";

export default function listRoles(client: Client, server_id: string) {
  const server = client.guilds.get(server_id);
  if (server) {
    server.roles
      .sort((roleA, roleB) => roleB.position - roleA.position)
      .map(role => log(role.id, role.name, role.position));
  }
}