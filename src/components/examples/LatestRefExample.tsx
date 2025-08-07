import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "../Button";

interface Hotkey {
  key: string;
  action: string;
}

// ❌ Approach 1: Include hotkeys in dependency array
function BadHotkeyHook(hotkeys: Hotkey[]) {
  const [pressedKey, setPressedKey] = useState<string>("");

  // This will create a new function reference whenever hotkeys change
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const hotkey = hotkeys.find((h) => h.key === event.key);
      if (hotkey) {
        setPressedKey(`${hotkey.key} (${hotkey.action})`);
      }
    },
    [hotkeys]
  ); // ❌ This dependency causes the callback to change frequently

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]); // This effect re-runs whenever onKeyDown changes

  return { pressedKey };
}

// ❌ Approach 2: Omit dependency (creates stale closure)
function StaleHotkeyHook(hotkeys: Hotkey[]) {
  const [pressedKey, setPressedKey] = useState<string>("");

  // This creates a stale closure - only sees initial hotkeys
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const hotkey = hotkeys.find((h) => h.key === event.key);
    if (hotkey) {
      setPressedKey(`${hotkey.key} (${hotkey.action})`);
    }
  }, []); // ❌ Missing dependency violates exhaustive-deps rule

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return { pressedKey };
}

// ✅ Approach 3: Latest ref pattern
function GoodHotkeyHook(hotkeys: Hotkey[]) {
  const [pressedKey, setPressedKey] = useState<string>("");
  const hotkeysRef = useRef(hotkeys);

  // Keep the ref current
  useEffect(() => {
    hotkeysRef.current = hotkeys;
  });

  // Stable callback that always accesses latest hotkeys
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const hotkey = hotkeysRef.current.find((h) => h.key === event.key);
    if (hotkey) {
      setPressedKey(`${hotkey.key} (${hotkey.action})`);
    }
  }, []); // ✅ Empty dependency array - stable callback

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]); // This effect only runs once

  return { pressedKey };
}

export function LatestRefExample() {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>([
    { key: "a", action: "Alert" },
    { key: "b", action: "Bold" },
  ]);

  const [activeDemo, setActiveDemo] = useState<"bad" | "stale" | "good">("bad");

  const addHotkey = () => {
    const keys = ["c", "d", "e", "f", "g"];
    const actions = ["Copy", "Delete", "Edit", "Find", "Go"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    setHotkeys((current) => [
      ...current,
      { key: randomKey, action: randomAction },
    ]);
  };

  // Use different hooks based on selected demo
  const badResult = BadHotkeyHook(hotkeys);
  const staleResult = StaleHotkeyHook(hotkeys);
  const goodResult = GoodHotkeyHook(hotkeys);

  const getResult = () => {
    switch (activeDemo) {
      case "bad":
        return badResult;
      case "stale":
        return staleResult;
      case "good":
        return goodResult;
    }
  };

  const { pressedKey } = getResult();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Latest Ref Pattern</h3>
        <p className="text-sm text-gray-600">
          How to create stable callbacks that access current values without
          dependency issues.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeDemo === "bad" ? "primary" : "secondary"}
          onClick={() => setActiveDemo("bad")}
          size="sm"
        >
          ❌ Bad (Unstable)
        </Button>
        <Button
          variant={activeDemo === "stale" ? "primary" : "secondary"}
          onClick={() => setActiveDemo("stale")}
          size="sm"
        >
          ❌ Stale Closure
        </Button>
        <Button
          variant={activeDemo === "good" ? "primary" : "secondary"}
          onClick={() => setActiveDemo("good")}
          size="sm"
        >
          ✅ Latest Ref
        </Button>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Try pressing keys:</strong>{" "}
          {hotkeys.map((h) => h.key).join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          Last pressed: <strong>{pressedKey || "None"}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Current hotkeys: {hotkeys.length}</span>
            <div className="text-xs text-gray-500">
              {hotkeys.map((h) => `${h.key}=${h.action}`).join(", ")}
            </div>
          </div>
          <Button onClick={addHotkey} size="sm">
            Add Random Hotkey
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">What's happening:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              <strong>❌ Bad:</strong> Callback recreated on every hotkey change
            </li>
            <li>
              <strong>❌ Stale:</strong> Callback only sees initial hotkeys (try
              adding new ones)
            </li>
            <li>
              <strong>✅ Good:</strong> Stable callback that always sees current
              hotkeys
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
