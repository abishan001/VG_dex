import React from 'react'
import { BodyContent } from '@/types'


function TableBody(props:BodyContent) {
  return (
    <div className='tableContainer' style={{backgroundColor:props.isTopic ? "black" : "white", color:props.isTopic ? "white":"black", height:"30px", borderRadius:"5px", alignItems:"center"}}>
        <div style={{display:"flex", flexDirection:"row"}}>
            {!props.isTopic && <img src={props.imgUrl || './next.svg'} height={15} width={25}/>}
            <h1 >{props.topic1}</h1>
        </div>
        <h1>{props.topic2}</h1>
    </div>
  )
}

export default TableBody