const DOMstuff= require('./DOMstuff');


const createDOMboardCo_opmode=(boardname)=>{
    let DOMboard=DOMstuff.createDOMboard(boardname);

    DOMboard.switchShooter=(boardname)=>{
        let opponent=document.querySelector(`.board-wrappers>:not(.${boardname})>.board`);
        opponent.classList.toggle('ready');
        document.querySelector(`.board-wrapper.${boardname}>.board`).classList.toggle('ready');
    }

    DOMboard.announceWinner=(boardname)=>{
        let continue_btn=document.createElement('button');
        continue_btn.textContent='Continue';
        document.querySelector('.board-wrappers').insertAdjacentElement('afterend',continue_btn);
        document.querySelector(`.board.${boardname}`).classList.add('ready');
        continue_btn.addEventListener('click',()=>{
            document.querySelector('.board-wrappers').innerHTML=``;
            document.querySelector('#change-mode-btn').style['opacity']='';
            continue_btn.remove();
            startCo_opgame();
        })
        document.querySelector('#current-info').textContent=`${(boardname==='p1')?'p2':'p1'} wins`;
    }

    return DOMboard
}


 

export const startCo_opgame=()=>{
    let curr_info=document.querySelector('#current-info');
    curr_info.textContent='';
    document.querySelector('.board-wrappers').innerHTML=``;
    let start_btn=document.createElement('button');
    start_btn.textContent='Start';
    let p1=createDOMboardCo_opmode('p1');
    let p2=createDOMboardCo_opmode('p2');
    p1.addDOMboard();
    p2.addDOMboard();
    p1.updateBoard();
    p1.getDOMboard().classList.toggle('ready');
    curr_info.textContent='p1 turn to set up the board (don\'t let the other player see you)';


    p1.addBoardbtn();
    let readybutton1=document.querySelector(`.board-wrapper.p1 .ready-btn`);
    readybutton1.addEventListener('click',()=>{
        p1.readyDOMboard();
        p2.updateBoard();
        p2.getDOMboard().classList.toggle('ready');
        p2.addBoardbtn();
        let readybutton2=document.querySelector(`.board-wrapper.p2 .ready-btn`);
        readybutton2.addEventListener('click',()=>{
            p2.readyDOMboard.bind(p2)();
            curr_info.textContent='Press start when both players are ready.';
            document.querySelector('.board-wrappers').insertAdjacentElement('afterend',start_btn)
        });
        curr_info.textContent='p2 turn to set up the board (don\'t let the other player see you)';
    })

    start_btn.addEventListener('click',()=>{
        document.querySelector('#change-mode-btn').style['opacity']='0';
        p1.startgame();
        p2.startgame();
        p2.getDOMboard().classList.toggle('ready');
        start_btn.remove();
        curr_info.textContent='';
    })

}



