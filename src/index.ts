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
    console.log("✅ Tray Icon wurde links geklickt!");
  }
);

// Callback für Rechtsklick
const rightClickCallback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" },
  () => {
    console.log("✅ Tray Icon wurde rechts geklickt!");
  }
);

// Callbacks setzen
lib.symbols.SetLeftClickCallback(leftClickCallback.pointer);
lib.symbols.SetRightClickCallback(rightClickCallback.pointer);

// Tray-Icon anzeigen
lib.symbols.AddTrayIcon();

// Message Loop im Hintergrund starten
lib.symbols.RunMessageLoop();

// Nach 10 Sekunden: alles wieder aufräumen
setTimeout(() => {
  lib.symbols.QuitMessageLoop();         // Loop stoppen
  lib.symbols.RemoveTrayIcon();          // Tray-Icon entfernen
  leftClickCallback.close();             // Callbacks schließen
  rightClickCallback.close();
  lib.close();                           // DLL entladen
  console.log("🧹 Tray-Icon entfernt und Ressourcen freigegeben.");
}, 10000);
