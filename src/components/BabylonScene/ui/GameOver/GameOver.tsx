import './GameOver.scss';

interface GameOverProps {
  onPlayAgain: () => void;
}

export const GameOver = ({ onPlayAgain }: GameOverProps) => {
  return (
    <div className='babylon-game-over'>
      <div className='babylon-game-over__trophy'>✦ 🏆 ✦</div>

      <h1>ASTRO DRIFT CHAMPION!</h1>

      <button type='button' className='babylon-game-over__button' onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
};
