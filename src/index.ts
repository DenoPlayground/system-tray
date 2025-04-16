const lib = Deno.dlopen("./src/binaries/win32/main.dll", {
  AddTrayIcon: { parameters: [], result: "void" },
  RemoveTrayIcon: { parameters: [], result: "void" },
  SetLeftClickCallback: { parameters: ["function"], result: "void" },
  SetRightClickCallback: { parameters: ["function"], result: "void" },
  RunMessageLoop: { parameters: [], result: "void" },
  QuitMessageLoop: { parameters: [], result: "void" },
});

// Callback für Linksklick
const leftClickCallback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" },
  () => {
    console.log("Tray Icon wurde links geklickt!");
  }
);

// Callback für Rechtsklick
const rightClickCallback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" },
  () => {
    console.log("Tray Icon wurde rechts geklickt!");
  }
);

// Callbacks setzen
lib.symbols.SetLeftClickCallback(leftClickCallback.pointer);
lib.symbols.SetRightClickCallback(rightClickCallback.pointer);

// Tray-Icon hinzufügen
lib.symbols.AddTrayIcon();

// Nachrichtenschleife starten
queueMicrotask(() => {
  lib.symbols.RunMessageLoop();
});

// Tray-Icon und Loop nach 10 Sekunden beenden
setTimeout(() => {
  lib.symbols.QuitMessageLoop();
  lib.symbols.RemoveTrayIcon();
  leftClickCallback.close();
  rightClickCallback.close();
  lib.close();
  console.log("Tray-Icon entfernt und Ressourcen freigegeben.");
}, 10000);
