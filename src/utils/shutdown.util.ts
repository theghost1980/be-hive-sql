const killGracefully = async () => {
  process.kill(process.pid, "SIGTERM");
  setTimeout(() => {
    console.error(
      "Apagado controlado excedió el tiempo limite, forzando salida."
    );
    process.exit(1);
  }, 30000);
};

export const ShutdownUtils = {
  killGracefully,
};
