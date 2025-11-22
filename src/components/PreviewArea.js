import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({
  sprites,
  selectedSpriteId,
  onSelectSprite,
  onAddSprite,
  isPlaying,
  onPlay,
  onStop,
}) {
  const stageWidth = 480;
  const stageHeight = 360;

  return (
    <div className="flex-none h-full overflow-y-auto p-2 flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">Stage</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-2 py-1 text-xs rounded text-white ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={isPlaying ? onStop : onPlay}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
            onClick={onAddSprite}
          >
            + Add Sprite
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center mb-3">
        <div
          className="relative bg-blue-50 border border-gray-300 rounded overflow-hidden"
          style={{ width: stageWidth, height: stageHeight }}
        >
          {sprites.map((sprite) => (
            <div
              key={sprite.id}
              className="absolute cursor-pointer"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(${sprite.x || 0}px, ${-(
                  sprite.y || 0
                )}px) translate(-50%, -50%)`,
              }}
              onClick={() => onSelectSprite(sprite.id)}
            >
              <div
                className="transition-transform duration-150"
                style={{
                  transform: `rotate(${sprite.direction - 90}deg)`,
                  transformOrigin: "center",
                }}
              >
                <CatSprite />
              </div>
              {(sprite.say || sprite.think) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginBottom: 4,
                  }}
                  className={`px-2 py-1 rounded-full text-[10px] border shadow-sm ${
                    sprite.say
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                >
                  {sprite.say || sprite.think}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1">
        <div className="text-xs font-semibold mb-1">Sprites</div>
        <div className="flex flex-wrap gap-1">
          {sprites.map((sprite) => (
            <button
              key={sprite.id}
              type="button"
              onClick={() => onSelectSprite(sprite.id)}
              className={`px-2 py-1 text-xs rounded border ${
                sprite.id === selectedSpriteId
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {sprite.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
