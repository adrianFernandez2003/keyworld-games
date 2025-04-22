"use client";
import { Block, SHAPES } from '../../../lib/types';

interface Props {
  upcomingBlocks: Block[];
}

function UpcomingBlocks({ upcomingBlocks }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow w-full h-[370px] flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Próximos bloques:</h3>
      <div className="flex-1 flex flex-col gap-4 justify-center upcoming no-borders">
        {upcomingBlocks.map((blockType, blockIndex) => {
          const shape = SHAPES[blockType].shape;

          return (
            <div
              key={blockIndex}
              className="h-[80px] flex flex-col justify-center items-center"
            >
              {shape.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                  {row.map((isFilled, cellIndex) => {
                    const cellClass = isFilled ? `cell ${blockType}` : 'cell Empty';
                    return (
                      <div
                        key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                        className={cellClass}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UpcomingBlocks;
