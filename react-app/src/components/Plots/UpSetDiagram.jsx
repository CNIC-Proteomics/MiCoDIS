/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from "react";
import { UpSetJS, extractCombinations } from "@upsetjs/react";
//import elems, { Row } from "./data";
//import "./styles.css";

function UpSetPlot(props) {
    const [elems, setElems] = React.useState(props.elems)

    const [selection, setSelection] = React.useState(null);

    const { sets, combinations } = useMemo( () => extractCombinations(elems), [elems] );
    
    const sortCombinations = useMemo(
        () => ({
            order: ['degree:desc'],
            limit:100,
            type: 'intersection'
        }), []
        )

    React.useEffect( () => {
        setElems(props.elems);
    }, [props] );
        
        
    const f1 = (x) => {
        console.log(x);
        props.setUpSetGenes({ elems: x.elems.map(e => ({ id: e.name })), name: x.name });
    };

    return (
        <UpSetJS
        sets={sets}
        combinations={sortCombinations}
        width={780}
        height={500}
        selection={selection}
        onHover={setSelection}
        onClick={() => f1(selection)}
        />
    );
}

export default function UpSetDiagram(props) {
    return (
        <div style={{ textAlign: 'center' }}>
            <UpSetPlot elems={props.elems} setUpSetGenes={props.setUpSetGenes} />
        </div>
    );
}
