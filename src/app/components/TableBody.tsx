import React, { useCallback } from 'react'
import { BodyContent } from '@/types'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

function TableBody(props:BodyContent) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
  
  const handleOnClick = ()=>{
    const params = new URLSearchParams(searchParams);
    if(props.address){
      router.push("./token/"+ props.address + '?' + createQueryString('query',JSON.stringify(props)))
    }
  }

  return (
    <div onClick={handleOnClick}
    //  href= {{
    //   pathname: `./token/${props.address}`,
    //   query: JSON.stringify(props)
    // }} 
    className='tableContainer' style={{backgroundColor:props.isTopic ? "black" : "white", color:props.isTopic ? "white":"black", height:"30px", borderRadius:"5px", alignItems:"center"}}>
        <div style={{display:"flex", flexDirection:"row"}}>
            {!props.isTopic && <img src={props.imgUrl || './next.svg'} height={15} width={25}/>}
            <h1 >{props.topic1}</h1>
        </div>
        <h1>{props.topic2}</h1>
        <h1 style={{font:"black"}}>{props.topic3}</h1>
    </div>
  )
}

export default TableBody