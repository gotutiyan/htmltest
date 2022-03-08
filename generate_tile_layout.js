function generate_tile_layout(){
    n = state.length
    return expand_root()
    block_num = random_int_range(1, int(0.5 * n*n));
    block_ix = [];
    n_put_block = 0;
    for(let i=0; i<block_num; i++){
        ix = put_block();
        if(ix != -1){
            block_ix.push(ix);
            n_put_block++;
            state[ix.x][ix.y] = config.BLOCK_ID;
        }else{
            break;
        }
    }
    start_ix = determine_start()
    console.log('block_num:', block_num)
    console.log('n_put_block:', n_put_block);
    console.log('start_ix:', start_ix);
    return {'start_ix':start_ix, 'block_ix':block_ix};
}

function put_block(){
    s_idx = random_int(n*n);
    for(let i=s_idx; i<s_idx+n*n; i++){
        x_idx = int((i%(n*n)) / n);
        y_idx = (i%(n*n)) % n;
        if(state[x_idx][y_idx] != config.WHITE_ID)continue;
        if(can_put_block(x_idx, y_idx)){
            return {'x':x_idx, 'y':y_idx};
        }
    }
    return -1;
}

function can_put_block(x, y){
    // return: bool
    state[x][y] = config.BLOCK_ID;
    print(is_connect(), is_half_oyler());
    ret = is_connect() && is_half_oyler()
    state[x][y] = config.WHITE_ID;
    return ret;
    // if(is_connect() == false){
    //     state[x][y] = config.WHITE_ID;
    //     return false;
    // }
    // dx = [0, 0, -1, 1];
    // dy = [1, -1, 0, 0];
    // n_more_three_degree = 0;
    // for(let i=0; i<4; i++){
    //     nx = x + dx[i];
    //     ny = y + dy[i];
    //     if(is_inner(nx) && is_inner(ny) && state[nx][ny]==config.WHITE_ID){
    //         if(calc_deg(nx, ny) >= 3)n_more_three_degree++;
    //     }
    // }
    // state[x][y] = config.WHITE_ID;
    // if(n_more_three_degree > 0){
    //     return true;
    // }else{
    //     return false;
    // }
}

function calc_deg(x, y){
    dx = [0, 0, -1, 1];
    dy = [1, -1, 0, 0];
    deg = 0;
    for(let i=0; i<4; i++){
        nx = x + dx[i];
        ny = y + dy[i];
        if(is_inner(nx) && is_inner(ny) && state[nx][ny]==config.WHITE_ID){
            deg++;
        }
    }
    return deg;
}

function near_wall(x, y){
    dx = [0, 0, -1, 1];
    dy = [1, -1, 0, 0];
    wall = 0;
    for(let i=0; i<4; i++){
        nx = x + dx[i];
        ny = y + dy[i];
        if(!is_inner(nx) || !is_inner(ny)){
            wall++;
        }
    }
    return wall;
}

function is_connect(){
    // 白マスが全て連結するか
    dx = [0, 0, -1, 1];
    dy = [1, -1, 0, 0];
    uf = new UnionFind(n*n);
    sum_white = 0;
    one_of_white_tile = -1;
    for(let i=s_idx; i<s_idx+n*n; i++){
        x_idx = int((i%(n*n)) / n);
        y_idx = (i%(n*n)) % n;
        if(state[x_idx][y_idx] == config.WHITE_ID){
            sum_white++;
            one_of_white_tile = x_idx*n + y_idx;
            for(let i=0; i<4; i++){
                nx = x_idx + dx[i];
                ny = y_idx + dy[i];
                if(is_inner(nx) && is_inner(ny) && state[nx][ny]==config.WHITE_ID){
                    uf.merge(i, nx*n+ny);
                }
            }
        }
    }
    return sum_white == uf.size(one_of_white_tile);
}

function is_half_oyler(){
    odd = 0;
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            deg = calc_deg(i, j);
            if(deg == 1)odd++;
            // if(deg % 2 == 1){
            //     wall = near_wall(i, j);
            //     if(deg == 3 && wall == 1)continue;
            //     odd++;
            // }
        }
    }
    console.log('odd in os_half_oyler:', odd);
    return (odd <= 2);
}

function determine_start(){
    candidates = [];
    for(let i=0;i<n;i++){
        console.log(state[i]);
        for(let j=0;j<n;j++){
            if(state[i][j] != config.WHITE_ID)continue;
            deg = calc_deg(i, j);
            if(deg % 2 == 1){
                wall = near_wall(i, j);
                if(deg == 3 && wall == 1)continue;
                candidates.push({'x':i, 'y':j, 'deg':deg});
            }
        }
    }
    candidates.sort(function(first, second){
        if(first.deg < second.deg)return -1;
        else if(first.deg > second.deg)return 1;
        else return 0;
    });
    if(candidates.length == 0){
        return {'x':0, 'y':0};
    }else{
        return {'x':candidates[0].x, 'y':candidates[0].y};
    }
}

function shuffle(x){
    for(let i=0; i<100; i++){
        idx1 = random_int(x.length);
        idx2 = random_int(y.length);
        [x[idx1], x[idx2]] = [x[idx2], x[idx1]];
    }
    return x;
}

function is_inner(x){
    return 0<=x && x<n;
}

function random_int(max) {
    // return [0, max)
    return Math.floor(Math.random() * max);
}

function random_int_range(min, max){
    t = max - min;
    rand = random_int(t);
    return min + rand;
}

class UnionFind{
    constructor(n){
        this.par = new Array(n).fill(-1);
    }

    root(x){
        if(this.par[x] < 0) return x;
        else return this.par[x] = this.root(this.par[x]);
    }

    same(a, b){
        return this.root(a) == this.root(b);
    }

    merge(a, b){
        a = this.root(a);
        b = this.root(b);
        if(a == b) return false;
        if(this.par[a] > this.par[b]) [a,b] = [b,a];
        this.par[a] += this.par[b];
        this.par[b] = a;
        return true;
    }

    size(x){
        return -this.par[this.root(x)];
    }
}

function expand_root(){
    dx = [0, 0, -1, 1];
    dy = [1, -1, 0, 0];
    state = new Array(n).fill(config.WHITE_ID);
    for(let i=0; i<n; i++)state[i] = new Array(n).fill(config.WHITE_ID);
    start_ix = {'x':-1, 'y':-1};
    start_ix.x = random_int(n);
    start_ix.y = random_int(n);
    state[start_ix.x][start_ix.y] = config.WROTE_ID;
    now_ix = start_ix;
    white_ix = [];
    while(true){
        sidx = random_int(4);
        found = false;
        for(let i=sidx; i<sidx+4; i++){
            nx = now_ix.x + dx[i%4];
            ny = now_ix.y + dy[i%4];
            if(is_inner(nx) && is_inner(ny) && state[nx][ny] == config.WHITE_ID){
                state[nx][ny] = config.WROTE_ID;
                // console.log('now_ix:',now_ix);
                white_ix.push({'x':nx, 'y':ny});
                now_ix.x = nx;
                now_ix.y = ny;
                found = true;
                break;
            }
        }
        if((white_ix.length+1) / (n*n) >= limitation_tiles_ratio){
            break;
        }
        if(!found)break;
    }
    // console.log(start_ix);
    // console.log(white_ix.length);
    // console.log(white_ix);
    return {'start_ix':start_ix, 'white_ix':white_ix};
}