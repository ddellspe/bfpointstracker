import React from "react";
import { Group } from "@visx/group";
import { curveStepAfter, curveStepBefore } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { Threshold } from "@visx/threshold";
import { scaleLinear } from "@visx/scale";
import { GridRows, GridColumns } from '@visx/grid';
import { AxisLeft, AxisBottom } from "@visx/axis";

export const background = "#ffffff";

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

export default function ScoreChart({
  width,
  height,
  gameData,
  margin=defaultMargin
}) {
  if (width < 10) return null;

  const finalHeight = Math.max((width * 9 / 16), 300);

  const time = (d) => d.time;
  const goal = (d) => d.goal;
  const points = (d) => d.points;

  const maxGame = Math.max(Math.ceil(Math.max(...gameData.map(time).filter(Boolean))), 1);
  var gameValues = [...Array(maxGame)].map((_, x) => (x + 1));
  if (maxGame >= 5) {
    gameValues = gameValues.map((x) => ([x - 0.5, x])).reduce((a, b) => a.concat(b), []);
  } else {
    gameValues = gameValues.map((x) => ([x - 0.75, x - 0.5, x - 0.25, x])).reduce((a, b) => a.concat(b), []);
  }

  const gameScale = scaleLinear({
    domain: [0, maxGame]
  });

  const maxPoints = Math.max(
    Math.ceil(
      Math.max(
        Math.max(...gameData.map(goal)),
        Math.max(...gameData.map(points))
      ) / 25
    ) || 0,
    1);
  const pointValues = [...Array(maxPoints)].map((_, y) => ((y + 1 ) * 25)).filter(Boolean);

  const pointScale = scaleLinear({
    domain: [
      Math.min(...gameData.map((d) => Math.min(goal(d), points(d)))) || 0,
      maxPoints * 25
    ],
    nice: false
  });

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = finalHeight - margin.top - margin.bottom;

  gameScale.range([0, xMax]);
  pointScale.range([yMax, 0]);

  return(
    <div>
      <svg width={width} height={finalHeight}>
        <rect
          x={0}
          y={0}
          width={width}
          height={finalHeight}
          fill={background}
          rx={14}
        />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={pointScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            tickValues={pointValues} />
          <GridColumns
            scale={gameScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            tickValues={gameValues} />
          <text x={xMax - 75} y={yMax - 5} fontSize={12}>
            Games Played
          </text>
          <AxisBottom
            top={yMax}
            scale={gameScale}
            tickFormat={(value) => Math.round(value)}
            numTicks={maxGame > 5 ? (width > 520 ? maxGame : (Math.ceil(maxGame / 2))) : maxGame}
          />
          <AxisLeft scale={pointScale} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={12}>
            Points Scored
          </text>
          <Threshold
            id={`${Math.random()}`}
            data={gameData}
            x={(d) => gameScale(time(d)) ?? 0}
            y0={(d) => pointScale(points(d)) ?? 0}
            y1={(d) => pointScale(goal(d)) ?? 0}
            clipAboveTo={0}
            clipBelowTo={yMax}
            curve={curveStepAfter}
            belowAreaProps={{
              fill: "red",
              fillOpacity: 0.4
            }}
            aboveAreaProps={{
              fill: "green",
              fillOpacity: 0.4
            }}
          />
          <LinePath
            data={gameData}
            curve={curveStepBefore}
            x={(d) => gameScale(time(d)) ?? 0}
            y={(d) => pointScale(goal(d)) ?? 0}
            stroke="#222"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
          <LinePath
            data={gameData}
            curve={curveStepAfter}
            x={(d) => gameScale(time(d)) ?? 0}
            y={(d) => pointScale(points(d)) ?? 0}
            stroke="#222"
            strokeWidth={1.5}
          />
        </Group>
      </svg>
    </div>
  );
}