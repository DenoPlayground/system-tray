const lib = Deno.dlopen("./src/binaries/win32/main.dll", {
  AddTrayIcon: { parameters: [], result: "void" },
  RemoveTrayIcon: { parameters: [], result: "void" },
  SetLeftClickCallback: { parameters: ["function"], result: "void" },
  SetRightClickCallback: { parameters: ["function"], result: "void" },
});

// Callback for Linksklick
const leftClickCallback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" },
  () => {
      console.log("Tray Icon wurde links geklickt!");
  }
);

// Callback for Rechtsklick
const rightClickCallback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" },
  () => {
      console.log("Tray Icon wurde rechts geklickt!");
  }
);

// Callbacks setzen
lib.symbols.SetLeftClickCallback(leftClickCallback.pointer);
lib.symbols.SetRightClickCallback(rightClickCallback.pointer);

// Tray-Icon hinzufuegen
lib.symbols.AddTrayIcon();

// Beispielsweise 10 Sekunden warten, dann Tray-Icon entfernen
setTimeout(() => {
  lib.symbols.RemoveTrayIcon();
  leftClickCallback.close();
  rightClickCallback.close();
  lib.close();
  console.log("Tray-Icon entfernt und Ressourcen freigegeben.");
}, 10000);
