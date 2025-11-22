import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [sprites, setSprites] = React.useState([
    {
      id: "sprite-1",
      name: "Sprite 1",
      x: 0,
      y: 0,
      direction: 90,
      initialX: 0,
      initialY: 0,
      initialDirection: 90,
      blocks: [],
      say: "",
      think: "",
    },
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = React.useState("sprite-1");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playRunIdRef = React.useRef(0);
  const collisionSwappedPairsRef = React.useRef(new Set());

  const handleAddSprite = () => {
    setSprites((prev) => {
      const nextIndex = prev.length + 1;
      const newId = `sprite-${nextIndex}`;
      const offsetX = 120 * (nextIndex - 1);
      const newSprite = {
        id: newId,
        name: `Sprite ${nextIndex}`,
        x: offsetX,
        y: 0,
        direction: 90,
        initialX: offsetX,
        initialY: 0,
        initialDirection: 90,
        blocks: [],
        say: "",
        think: "",
      };
      setSelectedSpriteId(newId);
      return [...prev, newSprite];
    });
  };

  const handleSelectSprite = (id) => {
    setSelectedSpriteId(id);
  };

  const restartRunWithSprites = (spritesSnapshot) => {
    const nextRunId = playRunIdRef.current + 1;
    playRunIdRef.current = nextRunId;

    spritesSnapshot.forEach((sprite) => {
      if (!sprite.blocks || sprite.blocks.length === 0) return;
      runSpriteScript(sprite.id, nextRunId, sprite);
    });
  };

  const createBlock = (type) => {
    const base = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      args: {},
    };

    switch (type) {
      case "EVENT_WHEN_FLAG_CLICKED":
      case "EVENT_WHEN_SPRITE_CLICKED":
        return base;
      case "MOTION_MOVE_STEPS":
        return { ...base, args: { steps: 10 } };
      case "MOTION_TURN_RIGHT":
      case "MOTION_TURN_LEFT":
        return { ...base, args: { degrees: 15 } };
      case "MOTION_GOTO_XY":
        return { ...base, args: { x: 0, y: 0 } };
      case "CONTROL_REPEAT_ANIMATION":
        return base;
      case "LOOKS_SAY_FOR_SECS":
      case "LOOKS_THINK_FOR_SECS":
        return { ...base, args: { message: "", seconds: 2 } };
      default:
        return base;
    }
  };

  const handleAddBlockToSelectedSprite = (blockType) => {
    if (!selectedSpriteId) return;

    const newBlock = createBlock(blockType);
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === selectedSpriteId
          ? { ...sprite, blocks: [...(sprite.blocks || []), newBlock] }
          : sprite
      )
    );
  };

  const handleRemoveBlockFromSelectedSprite = (blockId) => {
    if (!selectedSpriteId) return;

    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id !== selectedSpriteId
          ? sprite
          : {
              ...sprite,
              blocks: (sprite.blocks || []).filter(
                (block) => block.id !== blockId
              ),
            }
      )
    );
  };

  const handleUpdateBlockArgs = (blockId, argsUpdate) => {
    if (!selectedSpriteId) return;

    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id !== selectedSpriteId
          ? sprite
          : {
              ...sprite,
              blocks: (sprite.blocks || []).map((block) =>
                block.id === blockId
                  ? { ...block, args: { ...block.args, ...argsUpdate } }
                  : block
              ),
            }
      )
    );
  };

  const runSpriteScript = async (spriteId, runId, spriteSnapshot) => {
    const spriteOnStart =
      spriteSnapshot || sprites.find((sprite) => sprite.id === spriteId);
    if (!spriteOnStart) return;

    let x = spriteOnStart.x || 0;
    let y = spriteOnStart.y || 0;
    let direction = spriteOnStart.direction || 90;

    const applyPose = () => {
      setSprites((prev) => {
        const updated = prev.map((sprite) =>
          sprite.id === spriteId ? { ...sprite, x, y, direction } : sprite
        );

        if (playRunIdRef.current !== runId) {
          return updated;
        }

        const moving = updated.find((sprite) => sprite.id === spriteId);
        if (!moving) return updated;

        const radius = 80;
        const thresholdSq = radius * radius;

        for (let i = 0; i < updated.length; i += 1) {
          const other = updated[i];
          if (other.id === spriteId) continue;

          const dx = (moving.x || 0) - (other.x || 0);
          const dy = (moving.y || 0) - (other.y || 0);
          const distSq = dx * dx + dy * dy;

          if (distSq <= thresholdSq) {
            const ids = [moving.id, other.id].sort();
            const pairKey = `${ids[0]}|${ids[1]}`;

            if (collisionSwappedPairsRef.current.has(pairKey)) {
              break;
            }

            const indexA = updated.findIndex((sprite) => sprite.id === ids[0]);
            const indexB = updated.findIndex((sprite) => sprite.id === ids[1]);

            if (indexA === -1 || indexB === -1) {
              break;
            }

            const blocksA = updated[indexA].blocks || [];
            const blocksB = updated[indexB].blocks || [];

            const swapped = updated.map((sprite, index) => {
              if (index === indexA) {
                return { ...sprite, blocks: blocksB };
              }
              if (index === indexB) {
                return { ...sprite, blocks: blocksA };
              }
              return sprite;
            });

            collisionSwappedPairsRef.current.add(pairKey);

            setTimeout(() => {
              restartRunWithSprites(swapped);
            }, 0);

            return swapped;
          }
        }

        return updated;
      });
    };

    const setSay = (text) => {
      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === spriteId
            ? { ...sprite, say: text, think: text ? "" : sprite.think }
            : sprite
        )
      );
    };

    const setThink = (text) => {
      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === spriteId
            ? { ...sprite, think: text, say: text ? "" : sprite.say }
            : sprite
        )
      );
    };

    const blocks = spriteOnStart.blocks || [];

    const runSequence = async (sequence) => {
      for (let i = 0; i < sequence.length; i += 1) {
        if (playRunIdRef.current !== runId) {
          return;
        }

        const block = sequence[i];

        switch (block.type) {
          case "EVENT_WHEN_FLAG_CLICKED":
          case "EVENT_WHEN_SPRITE_CLICKED":
            // Events are visual only in this simplified interpreter.
            break;
          case "MOTION_MOVE_STEPS": {
            const steps = Number(block.args.steps || 0);
            const distance = steps;
            const frames = 20;
            const radians = ((direction - 90) * Math.PI) / 180;
            const dx = (distance * Math.cos(radians)) / frames;
            const dy = (distance * Math.sin(radians)) / frames;

            for (let f = 0; f < frames; f += 1) {
              if (playRunIdRef.current !== runId) return;
              x += dx;
              y += dy;
              applyPose();
              // Roughly 60fps
              // eslint-disable-next-line no-await-in-loop
              await delay(16);
            }
            break;
          }
          case "MOTION_TURN_RIGHT": {
            const total = Number(block.args.degrees || 0);
            const frames = 15;
            const delta = total / frames;
            for (let f = 0; f < frames; f += 1) {
              if (playRunIdRef.current !== runId) return;
              direction += delta;
              applyPose();
              // eslint-disable-next-line no-await-in-loop
              await delay(16);
            }
            break;
          }
          case "MOTION_TURN_LEFT": {
            const total = Number(block.args.degrees || 0);
            const frames = 15;
            const delta = total / frames;
            for (let f = 0; f < frames; f += 1) {
              if (playRunIdRef.current !== runId) return;
              direction -= delta;
              applyPose();
              // eslint-disable-next-line no-await-in-loop
              await delay(16);
            }
            break;
          }
          case "MOTION_GOTO_XY": {
            x = Number(block.args.x || 0);
            y = Number(block.args.y || 0);
            applyPose();
            break;
          }
          case "LOOKS_SAY_FOR_SECS": {
            const message = block.args.message || "";
            const seconds = Number(block.args.seconds || 2);
            setSay(message);
            // eslint-disable-next-line no-await-in-loop
            await delay(Math.max(0, seconds) * 1000);
            setSay("");
            break;
          }
          case "LOOKS_THINK_FOR_SECS": {
            const message = block.args.message || "";
            const seconds = Number(block.args.seconds || 2);
            setThink(message);
            // eslint-disable-next-line no-await-in-loop
            await delay(Math.max(0, seconds) * 1000);
            setThink("");
            break;
          }
          case "CONTROL_REPEAT_ANIMATION": {
            const prefix = sequence.slice(0, i);
            // Repeat all previous blocks as long as this run is active.
            // eslint-disable-next-line no-constant-condition
            while (playRunIdRef.current === runId) {
              // eslint-disable-next-line no-await-in-loop
              await runSequence(prefix);
            }
            return;
          }
          default:
            break;
        }
      }
    };

    await runSequence(blocks);
  };

  const handlePlay = () => {
    if (isPlaying) return;
    const nextRunId = playRunIdRef.current + 1;
    playRunIdRef.current = nextRunId;
    setIsPlaying(true);
    collisionSwappedPairsRef.current = new Set();

    const resetSprites = sprites.map((sprite) => ({
      ...sprite,
      x:
        sprite.initialX !== undefined && sprite.initialX !== null
          ? sprite.initialX
          : sprite.x || 0,
      y:
        sprite.initialY !== undefined && sprite.initialY !== null
          ? sprite.initialY
          : sprite.y || 0,
      direction:
        sprite.initialDirection !== undefined &&
        sprite.initialDirection !== null
          ? sprite.initialDirection
          : sprite.direction || 90,
      say: "",
      think: "",
    }));

    setSprites(resetSprites);

    resetSprites.forEach((sprite) => {
      if (!sprite.blocks || sprite.blocks.length === 0) return;
      runSpriteScript(sprite.id, nextRunId, sprite);
    });
  };

  const handleStop = () => {
    playRunIdRef.current += 1;
    setIsPlaying(false);
    setSprites((prev) =>
      prev.map((sprite) => ({ ...sprite, say: "", think: "" }))
    );
  };

  const selectedSprite = sprites.find(
    (sprite) => sprite.id === selectedSpriteId
  );

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar onAddBlock={handleAddBlockToSelectedSprite} />
          <MidArea
            blocks={selectedSprite ? selectedSprite.blocks || [] : []}
            onUpdateBlockArgs={handleUpdateBlockArgs}
            onAddBlock={handleAddBlockToSelectedSprite}
            onRemoveBlock={handleRemoveBlockFromSelectedSprite}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            selectedSpriteId={selectedSpriteId}
            onSelectSprite={handleSelectSprite}
            onAddSprite={handleAddSprite}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
}
