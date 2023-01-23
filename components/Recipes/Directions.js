


export default function Directions({directions}) {

    const renderDirections = () => {
        return directions.map(direction => {
            return(
                <li key={direction.key}>
                    <span className="font-normal">
                        {direction.description}
                    </span>
                </li>
            )
        })
    }

    return(
        <ol className="list-decimal ml-10 leading-8 font-bold">
            {renderDirections()}
        </ol>
    )
}