import React from "react";

function dataUI(data: object) {
  const dat = Array.isArray(data) ? Array.from(data) : [];

  return (
    <div>
      {/* {
        arrayData.map((dat)=>{
            const res = data[dat]
            return(

            )
        })
      } */}
    </div>
  );
}

export default dataUI;
