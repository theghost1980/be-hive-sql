import { Router } from "express";

const router = Router();

router.get("/server", async (req, res) => {
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
  };
  res.status(200).json({ server_data_info });
});

export default router;
