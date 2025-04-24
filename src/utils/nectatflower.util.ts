import { lastTestedRPCNode } from "..";
import { getAccountMetadata } from "../hive/DHive.api";
import { AppLogger } from "./logger.util";

export const checkRPCHive = async () => {
  try {
    const metadata_nectarflower = await getAccountMetadata("nectarflower");
    if (!metadata_nectarflower || !metadata_nectarflower.nodes[0])
      throw new Error("Data no encontrada. nectarflower vacia o sin metadatos");
    lastTestedRPCNode.nectarflower_ts = Date.now();
    lastTestedRPCNode.rpc_layer_1_url = metadata_nectarflower.nodes[0];
    AppLogger.info(
      `Rpc Node Checks, Done! Node: ${lastTestedRPCNode.rpc_layer_1_url} ts: ${lastTestedRPCNode.nectarflower_ts}`
    );
  } catch (error: any) {
    AppLogger.error("¡Error crítico! Metadata de nectarflower", {
      status: "unrecheable",
      error_message: error.message,
    });
    throw error;
  }
};
