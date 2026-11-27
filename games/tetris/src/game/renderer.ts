import { THEME_COLORS } from '../../../../styles/theme';
import {
  BOARD_COLS,
  BOARD_ROWS,
  CELL_SIZE,
  CLEAR_FLASH_SEC,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  PIECE_COLORS,
} from './constants';
import { getGhostRow, getPieceCells } from './engine';
import type { GameState, PlacementHint } from './types';

export function configureHiDPICanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const targetW = Math.round(LOGICAL_WIDTH * dpr);
  const targetH = Math.round(LOGICAL_HEIGHT * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  color: string,
  alpha = 1,
): void {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

  // Subtle top/left highlight bevel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, 4);
  ctx.fillRect(x + 1, y + 1, 4, CELL_SIZE - 2);

  // Crisp charcoal cell border
  ctx.strokeStyle = THEME_COLORS.deepcharcoal;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

  ctx.restore();
}

export function renderTetris(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  hint: PlacementHint | null,
): void {
  // Background
  ctx.fillStyle = THEME_COLORS.softivory;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(145, 139, 131, 0.22)';
  ctx.lineWidth = 1;
  for (let c = 1; c < BOARD_COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL_SIZE, 0);
    ctx.lineTo(c * CELL_SIZE, LOGICAL_HEIGHT);
    ctx.stroke();
  }
  for (let r = 1; r < BOARD_ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL_SIZE);
    ctx.lineTo(LOGICAL_WIDTH, r * CELL_SIZE);
    ctx.stroke();
  }

  // Locked board cells
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const cell = state.board[r][c];
      if (cell) {
        drawCell(ctx, r, c, PIECE_COLORS[cell], 1);
      }
    }
  }

  // Placement hint dashed outline
  if (hint && state.phase === 'PLAYING') {
    ctx.save();
    ctx.strokeStyle = THEME_COLORS.bookpurple;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    for (const [r, c] of hint.cells) {
      if (r >= 0) {
        ctx.strokeRect(
          c * CELL_SIZE + 2,
          r * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
        );
      }
    }
    ctx.restore();
  }

  // Active & Ghost pieces
  if (state.active && state.phase !== 'PAUSED') {
    if (state.ghostEnabled && state.phase === 'PLAYING') {
      const ghostRow = getGhostRow(state.board, state.active);
      if (ghostRow !== state.active.row) {
        const ghostCells = getPieceCells(
          state.active.type,
          state.active.rotation,
          ghostRow,
          state.active.col,
        );
        for (const [r, c] of ghostCells) {
          if (r >= 0) {
            drawCell(ctx, r, c, PIECE_COLORS[state.active.type], 0.24);
          }
        }
      }
    }

    const activeCells = getPieceCells(
      state.active.type,
      state.active.rotation,
      state.active.row,
      state.active.col,
    );
    for (const [r, c] of activeCells) {
      if (r >= 0) {
        drawCell(ctx, r, c, PIECE_COLORS[state.active.type], 1);
      }
    }
  }

  // Line-clear flash
  if (state.flashTimer > 0) {
    const alpha = (state.flashTimer / CLEAR_FLASH_SEC) * 0.65;
    ctx.fillStyle = `rgba(60, 16, 83, ${alpha.toFixed(3)})`;
    for (const rowIdx of state.flashRows) {
      ctx.fillRect(0, rowIdx * CELL_SIZE, LOGICAL_WIDTH, CELL_SIZE);
    }
  }
}
