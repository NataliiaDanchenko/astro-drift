interface ScoreProps {
    score: number;
}

export const Score = ({
    score,
}: ScoreProps) => {
    return (
        <div className='babylon-score'>
            SCORE: {score}
        </div>
    );
};