import './GameOver.scss';

interface GameOverProps {
  onPlayAgain: () => void;
}

export const GameOver = ({ onPlayAgain }: GameOverProps) => {
  return (
    <div className='babylon-game-over'>
      <h1>ASTRO DRIFT — YOU WIN!</h1>

      <p>🏆 Prize Unlocked!</p>

      <button type='button' className='babylon-game-over__button' onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
};
