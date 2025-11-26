import React from "react";

export default function MidArea({
  blocks,
  onUpdateBlockArgs,
  onAddBlock,
  onRemoveBlock,
  onReorderBlock,
}) {
  const handleChangeArgs = (blockId, argsUpdate) => {
    if (!onUpdateBlockArgs) return;
    onUpdateBlockArgs(blockId, argsUpdate);
  };

  const handleRemove = (blockId) => {
    if (!onRemoveBlock) return;
    onRemoveBlock(blockId);
  };

  const handleBlockDragStart = (event, blockId) => {
    if (!event.dataTransfer) return;
    // Debug: track when block drag for reorder starts
    // eslint-disable-next-line no-console
    console.log("[MidArea] dragstart block", blockId);
    event.dataTransfer.setData("application/x-block-reorder", blockId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleBlockDragOver = (event) => {
    if (!event.dataTransfer) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const handleBlockDrop = (event, targetBlockId) => {
    if (!event.dataTransfer || !onReorderBlock) return;
    const sourceId = event.dataTransfer.getData("application/x-block-reorder");
    if (!sourceId || sourceId === targetBlockId) return;
    // Debug: track when reorder drop happens
    // eslint-disable-next-line no-console
    console.log("[MidArea] drop reorder", {
      from: sourceId,
      to: targetBlockId,
    });
    event.preventDefault();
    event.stopPropagation();
    onReorderBlock(sourceId, targetBlockId);
  };

  const handleDragOver = (event) => {
    if (!event.dataTransfer) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!onAddBlock || !event.dataTransfer) return;

    const type =
      event.dataTransfer.getData("application/x-block-type") ||
      event.dataTransfer.getData("text/plain");

    if (!type) return;
    onAddBlock(type);
  };

  return (
    <div
      className="flex-1 h-full overflow-auto p-2 bg-gray-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="font-bold text-sm mb-2">Scripts</div>
      {!blocks || blocks.length === 0 ? (
        <div className="text-xs text-gray-500">
          Click blocks in the sidebar to build a script for this sprite.
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={(event) => handleBlockDragStart(event, block.id)}
              onDragOver={handleBlockDragOver}
              onDrop={(event) => handleBlockDrop(event, block.id)}
            >
              <BlockEditor
                block={block}
                onChangeArgs={(args) => handleChangeArgs(block.id, args)}
                onRemove={() => handleRemove(block.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockEditor({ block, onChangeArgs, onRemove }) {
  const handleNumberChange = (name) => (event) => {
    const value = Number(event.target.value);
    onChangeArgs({ [name]: Number.isNaN(value) ? 0 : value });
  };

  const handleTextChange = (name) => (event) => {
    onChangeArgs({ [name]: event.target.value });
  };

  const commonClass =
    "inline-flex items-center flex-wrap text-xs px-2 py-1 rounded text-white";

  switch (block.type) {
    case "EVENT_WHEN_FLAG_CLICKED":
      return (
        <div className={`${commonClass} bg-yellow-500`}>
          <span>When flag clicked</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "EVENT_WHEN_SPRITE_CLICKED":
      return (
        <div className={`${commonClass} bg-yellow-500`}>
          <span>When this sprite clicked</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "MOTION_MOVE_STEPS":
      return (
        <div className={`${commonClass} bg-blue-500 space-x-1`}>
          <span>Move</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.steps}
            onChange={handleNumberChange("steps")}
          />
          <span>steps</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "MOTION_TURN_RIGHT":
      return (
        <div className={`${commonClass} bg-blue-500 space-x-1`}>
          <span>Turn right</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.degrees}
            onChange={handleNumberChange("degrees")}
          />
          <span>degrees</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "MOTION_TURN_LEFT":
      return (
        <div className={`${commonClass} bg-blue-500 space-x-1`}>
          <span>Turn left</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.degrees}
            onChange={handleNumberChange("degrees")}
          />
          <span>degrees</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "MOTION_GOTO_XY":
      return (
        <div className={`${commonClass} bg-blue-500 space-x-1`}>
          <span>Go to x:</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.x}
            onChange={handleNumberChange("x")}
          />
          <span>y:</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.y}
            onChange={handleNumberChange("y")}
          />
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "CONTROL_REPEAT_ANIMATION":
      return (
        <div className={`${commonClass} bg-orange-500`}>
          <span>Repeat animation</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "LOOKS_SAY_FOR_SECS":
      return (
        <div className={`${commonClass} bg-purple-500 space-x-1`}>
          <span>Say</span>
          <input
            type="text"
            className="px-1 py-0.5 rounded text-xs text-black"
            value={block.args.message}
            onChange={handleTextChange("message")}
          />
          <span>for</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.seconds}
            onChange={handleNumberChange("seconds")}
          />
          <span>seconds</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    case "LOOKS_THINK_FOR_SECS":
      return (
        <div className={`${commonClass} bg-purple-500 space-x-1`}>
          <span>Think</span>
          <input
            type="text"
            className="px-1 py-0.5 rounded text-xs text-black"
            value={block.args.message}
            onChange={handleTextChange("message")}
          />
          <span>for</span>
          <input
            type="number"
            className="w-14 px-1 py-0.5 rounded text-xs text-black"
            value={block.args.seconds}
            onChange={handleNumberChange("seconds")}
          />
          <span>seconds</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
    default:
      return (
        <div className={`${commonClass} bg-gray-400`}>
          <span>Unknown block</span>
          <button
            type="button"
            className="ml-2 px-1 rounded bg-white bg-opacity-20 text-[10px]"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      );
  }
}
