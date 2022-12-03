
export class Ship{
    constructor(name,length,vertical){
        this.name=name;
        this.length=length;
        this.vertical=vertical;
        this.sink=false;
        this.shipParts=[];
        for(let i=0;i<length;i++){
            this.shipParts.push(new ShipPart(name,i,length,vertical))
        };
    }

    hit=(index)=>{
        this.shipParts[index].hit=true;
    }

    setDirection=()=>{
        for(let k=0;k<this.shipParts.length;k++)
        this.shipParts[k].vertical=this.vertical;
    }

    isSunk=()=>{
        for(let i=0;i<this.length;i++){
            if(!this.shipParts[i].hit) return false
        }
        this.sink=true;
        return true
    }
}

class ShipPart{
    constructor(name,index,maxlen,vertical){
        this.name=name;
        this.index=index;
        this.maxlen=maxlen;
        this.vertical=vertical;
        this.hit=false;
    }
}


//a board object that takes in the number of ship as the first parameter
//and an object that conatins ships

export const Board= (shipamount,ships) =>{
    let board=Array(10);
    for(let i=0;i<10;i++){
        board[i]=Array(10)
        for(let k=0;k<10;k++){
            board[i][k]=false;
        }
    };

    const checkWin=()=>{
        for(const i in ships) if(!ships[i].sink) return false
        return true
    }

    const clearboard=()=>{
        for(let i=0;i<board.length;i++){
            for(let k=0;k<board[i].length;k++){
                board[i][k]=false;
            }
        }
    }

    const explode= (pos)=>{
        if(pos[0]-1>-1&&pos[0]-1<10){
            (board[pos[0]-1][pos[1]]===false)?board[pos[0]-1][pos[1]]=true:0;
            (board[pos[0]-1][pos[1]+1]===false)?board[pos[0]-1][pos[1]+1]=true:0;
            (board[pos[0]-1][pos[1]-1]===false)?board[pos[0]-1][pos[1]-1]=true:0;
        }
        if(pos[0]+1>-1&&pos[0]+1<10){
            (board[pos[0]+1][pos[1]]===false)?board[pos[0]+1][pos[1]]=true:0;
            (board[pos[0]+1][pos[1]+1]===false)?board[pos[0]+1][pos[1]+1]=true:0;
            (board[pos[0]+1][pos[1]-1]===false)?board[pos[0]+1][pos[1]-1]=true:0;
        }
        (board[pos[0]][pos[1]+1]===false)?board[pos[0]][pos[1]+1]=true:0;
        (board[pos[0]][pos[1]-1]===false)?board[pos[0]][pos[1]-1]=true:0;
    }

    //hit all the spaces around the ship once it is sunk

    const shipExplode= (pos,maxlen,isVertical)=>{
        let index=board[pos[0]][pos[1]].index;
        if(isVertical){
            for(let i=index,k=0;i<maxlen;i++,k+=1){
               explode([pos[0]+k,pos[1]]);
            } 
            for(let i=index-1,k=1;i>-1;i--,k+=1){
                explode([pos[0]-k,pos[1]]);
            }
        }
        else{
            for(let i=index,k=0;i<maxlen;i++,k+=1){
                explode([pos[0],pos[1]+k]);
             } 
            for(let i=index-1,k=1;i>-1;i--,k+=1){
                 explode([pos[0],pos[1]-k]);
            }
        }
    }

    //fired at a ship part and check if a ship has sunk yet

    const firedAndCheckedSunk= (name,i)=>{
        ships[name].hit(i);
        return(ships[name].isSunk())
    }

    //fired at the location return true if it's a ship part
    //and return false if it's not
    
    const fired= (pos)=>{
        if(pos[0]<board.length&&pos[1]<board[0].length
            &&pos[0]>=0&&pos[1]>=0){
                if(board[pos[0]][pos[1]]){
                    const ship=board[pos[0]][pos[1]];
                    board[pos[0]][pos[1]].hit=true
                    if(firedAndCheckedSunk(ship.name,ship.index)){
                       shipExplode(pos,ship.maxlen,ship.vertical);
                       return[true,true,checkWin()]
                    }
                    return [true,false,false]
                }
                board[pos[0]][pos[1]]=true;
                return [false]
            }
    }



    //check for available spot

    const checkSpace= (pos)=>{
        if(board[pos[0]]) 
          return (board[pos[0]][pos[1]]!==undefined&&!board[pos[0]][pos[1]]&&checkAroundSpaces(pos))
        return false
    }

    //check for spaces around the spot

    const checkUp= (pos)=>{
        //edge case
        if(pos[0]===0) return true
        if(pos[0]<board.length&&pos[1]<board[0].length
            &&pos[0]>=0&&pos[1]>=0)
          return (!board[pos[0]-1][pos[1]])
        return false
    }

    const checkDown= (pos)=>{
        //edge case
        if(pos[0]===board.length-1) return true
        if(pos[0]<board.length&&pos[1]<board[0].length
            &&pos[0]>=0&&pos[1]>=0)
          return (!board[pos[0]+1][pos[1]])
        return false
    }

    const checkLeft= (pos)=>{
        //edge case
        if(pos[1]===0) return true
        if(pos[0]<board.length&&pos[1]<board[0].length
            &&pos[0]>=0&&pos[1]>=0)
          return (!board[pos[0]][pos[1]-1]);
        return false
    }

    const checkRight= (pos)=>{
        //edge case
        if(pos[1]===board.length-1) return true
        if(pos[0]<board.length&&pos[1]<board[0].length
            &&pos[0]>=0&&pos[1]>=0)
           return (!board[pos[0]][pos[1]+1]);
        return false
    }

    const checkUpLeft=(pos)=>{
        //edge case
        if(pos[0]===0) return true
        if(checkUp(pos)){
            let newPos=[pos[0]-1,pos[1]];
            return checkLeft(newPos);
        }
        return false
    }

    const checkUpRight=(pos)=>{
        //edge case
        if(pos[0]===0) return true
        if(checkUp(pos)){
            let newPos=[pos[0]-1,pos[1]];
            return checkRight(newPos);
        }
        return false
    }

    const checkDownLeft=(pos)=>{
        //edge case
        if(pos[0]===board.length-1) return true
        if(checkDown(pos)){
            let newPos=[pos[0]+1,pos[1]];
            return checkLeft(newPos);
        }
        return false
    }

    const checkDownRight=(pos)=>{
        //edge case
        if(pos[0]===board.length-1) return true
        if(checkDown(pos)){
            let newPos=[pos[0]+1,pos[1]];
            return checkRight(newPos);
        }
        return false
    }

    const checkAroundSpaces= (pos)=>{
        return(
            checkUp(pos)&&
            checkDown(pos)&&
            checkLeft(pos)&&
            checkRight(pos)&&
            checkUpLeft(pos)&&
            checkUpRight(pos)&&
            checkDownLeft(pos)&&
            checkDownRight(pos)
        )
    }


    //recursive function to check if you can place
    //a ship and place it


    const horizontalCheckAndPlace= (name,pos,len,index=0)=>{
        if(!checkSpace(pos)) return false;

        if(index===len-1){
            board[pos[0]][pos[1]]=ships[name].shipParts[index];
            return true;
        }


        if(horizontalCheckAndPlace(name,[pos[0],pos[1]+1],len,index+=1)){
            board[pos[0]][pos[1]]=ships[name].shipParts[index-=1];
            return true;
        }

        else return false
    }

    const verticalCheckAndPlace= (name,pos,len,index=0)=>{
        if(!checkSpace(pos)) return false;

        if(index===len-1){
            board[pos[0]][pos[1]]=ships[name].shipParts[index];
            return true;
        }


        if(verticalCheckAndPlace(name,[pos[0]+1,pos[1]],len,index+=1)){
            board[pos[0]][pos[1]]=ships[name].shipParts[index-=1];
            return true;
        }

        else return false
    }


    const placeShip=function (name,pos){
        const ship=ships[name];
        const shipLength=ship.length;
        const shipName=ship.name;
        const isVertical=ship.vertical;
        if(isVertical) return verticalCheckAndPlace(shipName,pos,shipLength);
        else return horizontalCheckAndPlace(shipName,pos,shipLength);
    };

    const deleteShip=(pos)=>{
        let isVertical=board[pos[0]][pos[1]].vertical;
        let index=board[pos[0]][pos[1]].index;
        let maxlen=board[pos[0]][pos[1]].maxlen;
        if(isVertical){
            for(let i=index,k=0;i<maxlen;i++,k+=1){
               board[pos[0]+k][pos[1]]=false;
            } 
            for(let i=index-1,k=1;i>-1;i--,k+=1){
                board[pos[0]-k][pos[1]]=false;
            }
        }
        else{
            for(let i=index,k=0;i<maxlen;i++,k+=1){
                board[pos[0]][pos[1]+k]=false;
             } 
            for(let i=index-1,k=1;i>-1;i--,k+=1){
                board[pos[0]][pos[1]-k]=false;
            }
        }
    }

    //change direction of the ship
     const changeDirection=(pos)=>{
        const name=board[pos[0]][pos[1]].name;
        const startPos=(board[pos[0]][pos[1]].vertical)?
        [pos[0]-board[pos[0]][pos[1]].index,pos[1]]:
        [pos[0],pos[1]-board[pos[0]][pos[1]].index];
        deleteShip(startPos);
        ships[name].vertical=(!ships[name].vertical);
        ships[name].setDirection();
        if(placeShip(name,startPos)){
            return true;
        }
        else{
            ships[name].vertical=(!ships[name].vertical);
            ships[name].setDirection();
            placeShip(name,startPos);
            return false;
        }
    }

    const horizontalRandomBoard=(len)=>{
        let randomBoard=[];
        for (let i=0; i<board.length;i++){
            let row=[i,[]];
            for (let k=0; k<board.length;k++){
                if(board[i][k]!==false){
                    let currlen=row[1].length-1;
                    while(row[1][currlen]<k&&row[1][currlen]>=(k-len)){
                        row[1].pop();
                        currlen=row[1].length-1;
                    }

                    while(board[i][k]&&k<board.length)k++;

                    continue;
                }
                if(!checkUp([i,k])||!checkDown([i,k])){
                    let currlen=row[1].length-1;
                    while(row[1][currlen]<k&&row[1][currlen]>=(k-len)){
                        row[1].pop();
                        currlen=row[1].length-1;
                    }

                    while((!checkUp([i,k])||!checkDown([i,k]))&&k<board.length) k++;
                    continue;
                }
                if(!board[i][k]&&k<board.length-len+1) row[1]=[...row[1],k];
            }
            (row[1].length!==0)?randomBoard=[...randomBoard,row]:randomBoard;
        }
        return randomBoard;
    }

    const verticalRandomBoard= (len)=>{
        let randomBoard=[];
        for (let i=0; i<board.length;i++){
            let col=[i,[]];
            for (let k=0; k<board.length;k++){
                if(board[k][i]!==false){
                    let currlen=col[1].length-1;
                    while(col[1][currlen]<k&&col[1][currlen]>=(k-len)){
                        col[1].pop();
                        currlen=col[1].length-1;
                    }

                    while(board[k]&&k<board.length){
                        if(board[k][i])k++;
                        else break;
                    }

                    continue;
                }
                if(!checkLeft([k,i])||!checkRight([k,i])){
                    let currlen=col[1].length-1;
                    while(col[1][currlen]<k&&col[1][currlen]>=(k-len)){
                        col[1].pop();
                        currlen=col[1].length-1;
                    }

                    while(board[k]&&k<board.length){
                        if((!checkLeft([k,i])||!checkRight([k,i])))k++;
                        else break;
                    }

                    continue;
                }
                if(!board[k][i]&&k<board.length-len+1) col[1]=[...col[1],k];
            }
            (col[1].length!==0)?randomBoard=[...randomBoard,col]:randomBoard;
        }
        return randomBoard;
    }

    //create a random board that exclude all the spots that were
    //fired or already taken
    const createRandomBoard= (len,isVertical) =>{
        if(isVertical){
            return verticalRandomBoard(len);
        }

        return horizontalRandomBoard(len);
    }

    //radomly place all the ship on board

    const randomPlace= ()=>{
        try{
            for(const i in ships){
                (Math.floor(Math.random()*2)===0)?ships[i].vertical=true:ships[i].vertical=false;
                //setting all ship part vertical property like the ship vertical property
                for(let k=0;k<ships[i].shipParts.length;k++)
                   ships[i].shipParts[k].vertical=ships[i].vertical;
                //get all possible location to fired
                let randomBoard=createRandomBoard(ships[i].length,ships[i].vertical);
                let randomRow=Math.floor(Math.random()*randomBoard.length);
                let randomCol=Math.floor(Math.random()*randomBoard[randomRow][1].length);
                if(ships[i].vertical){
                    placeShip(i,[randomBoard[randomRow][1][randomCol],randomBoard[randomRow][0]])
                    
                }
                else{
                    placeShip(i,[randomBoard[randomRow][0],randomBoard[randomRow][1][randomCol]])
                }
                
            }
        }
        catch{
            clearboard();
            randomPlace();
        }
    }

    const getBoard= () => board


    return {
        placeShip,
        checkSpace,
        horizontalCheckAndPlace,
        verticalCheckAndPlace,
        createRandomBoard,
        randomPlace,
        checkLeft,
        checkRight,
        checkUp,
        checkDown,
        horizontalRandomBoard,
        verticalRandomBoard,
        explode,
        shipExplode,
        fired,
        firedAndCheckedSunk,
        deleteShip,
        clearboard,
        changeDirection,
        getBoard
    };
};


