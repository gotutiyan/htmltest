config = {
    'WHITE_ID':0,
    'WROTE_ID':1,
    'BLOCK_ID':2,
}
const N_STAGES = 10;
const WHITE_ID=0;
const WROTE_ID=1;
const BLOCK_ID=2;

const tile_colors = [
    '#84302F',
    '#2F4E84',
    '#2F8439',
    '#592F84',
    '#846A2F',
    '#2F8482',
    '#842F60',
    '#3E2F84',
    '#7F842F',
    '#842F56'
]

const criteria = [
    '',
    '世界1で30ステージ以上',
    '世界2で60ステージ以上',
    '世界1,2,3の合計で\n200ステージ以上',
    '世界1,2,3,4の合計で\n400ステージ以上',
    '世界5で150ステージ以上',
    '世界6で200ステージ以上',
    '世界1,2,3,4,5,6,7の合計で\n1000ステージ以上',
    '世界8で300ステージ以上',
    '世界9で500ステージ以上',
    'Coming soon...'
]

let judge_criteria = [
    function(){return true},
    function(){
        return clear_count[0] >= 30;
    },
    function(){
        return clear_count[1] >= 60;
    },
    function(){
        return clear_count[0] + clear_count[1] + clear_count[2] >= 200;
    },
    function(){
        return clear_count[0] + clear_count[1] + clear_count[2] + clear_count[3] >= 400;
    },
    function(){
        return clear_count[4] >= 150;
    },
    function(){
        return clear_count[5] >= 200;
    },
    function(){
        sum = 0;
        for(let i=0;i<7;i++)sum += clear_count[i];
        return sum >= 1000;
    },
    function(){
        return clear_count[7] >= 300;
    },
    function(){
        return clear_count[8] >= 500;
    },
    function(){
        // coming soon
        return false;
    }
]
