import { Router } from "express";

const router = Router();

router.get("/info", async (req, res) => {
  const server_data_info = {
    nodes_rpc_tests: {
      made_by: "nectarflower_js module",
      github_repo: "https://github.com/TheCrazyGM/nectarflower-js/tree/main",
      hive_web3_account: "https://peakd.com/@nectarflower",
      contact_dev: "thecrazygm@gmail.com",
    },
    hivesql: {
      description: "Library to connect SQL with Hive blockchain",
      info: "https://hivesql.io/",
      lib_nodejs_sql_used: "mssql",
    },
    local_db: {
      SQL_lite: "SQLite Client for Node.js Apps",
      npm_url: "https://www.npmjs.com/package/sqlite",
    },
    ai_helpers: {
      chatGPT: {
        used_in: ["Refactoring code", "structure designs", "code corrections"],
        more_info_url: "https://chatgpt.com/",
      },
      gemini_v_2_5_flash_experimental: {
        used_in: ["Refactoring code", "structure designs", "code corrections"],
        more_info_url: "https://gemini.google.com/",
      },
    },
  };
  res.status(200).json({ server_data_info });
});

export default router;
