//


// Model

type Hist = {
    state:  Bob[],
    cs:     Hist[]
}

type Store = {
    bobs: Bob[],
    cbob: Bob | null,
    hist: Hist,
    hist0: string[],
    banners_shown: boolean
}

var store: Store = {
    bobs: [],
    cbob: null,
    hist: {
        state: [], cs: []
    },
    hist0: [''],
    banners_shown: true
};
var editor_canvas: p5;
window['store'] = store;
window['editor_canvas'] = editor_canvas;

class Bob {
    id: string;

    px: number;
    py: number;
    rot: number;
    
    bw: number;
    bh: number;

    cls: string;

    // zid: number;
}

function newBob(): Bob {
    return {
        id: String(store.bobs.length),
        px: 0,
        py: 0,
        rot: 0,
        bw: 200,
        bh: 100,
        cls: 'room'
    }
}

function snapshot() {
    store.hist0.push(JSON.stringify(store.bobs));
}
function save() {
    download(JSON.stringify(store.hist0), 'arch-project.json', 'text/plain');
}
function load(file) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(e) {
        // Render thumbnail.
        store.hist0 = JSON.parse(e.target.result);
        store.bobs = JSON.parse(store.hist0[store.hist0.length-1]);
    };

    // Read in the image file as a data URL.
    reader.readAsText(file);
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}
/////////////////////

function test() {
    let x = newBob();
    store.bobs.push(x);
    store.cbob = store.bobs[stop.length-1];
}

function $begin() {
    /// Prepare MPane tabs (hide all, enable buttons, attach handler for tab clicks)
    $('#mpane-tabs > div').css({display: 'none'});
    $('#mpane-tab-bar > button').click(function() {
        let cs = this.classList[0];
        $('#mpane-tabs > div').css({display: 'none'});
        $('#mpane-tabs > .'+cs).css('display', 'block');
        $('#mpane-tab-bar > button')
            .removeAttr('disabled');
        $(this).attr('disabled', '');
    });
    $('#banner-toggle').click(function() {
        if(store.banners_shown) {
            $('.banner').css('display', 'none');
            store.banners_shown = false;
            this.textContent = 'Banners Hidden';
        }
        else {
            $('.banner').css('display', 'initial');
            store.banners_shown = true;
            this.textContent = 'Banners Shown';
        }
    });
    $('#bob-add').click(function() {
        store.bobs.push(newBob());
        store.cbob = store.bobs[store.bobs.length-1];
    });
    $('#bobs').change(function() {
        let k = $('#bobs > option:selected').text();
        let x = store.bobs.filter((b) => b.id == k);
        if(x.length) store.cbob = x[0];
    });
    $('#snapshot-button').click(snapshot);
    $('#save-button').click(save);
    $('#load-button').click(function() {
        $('#inputId').click();
    });
    $('#inputId').change(function() {
        load(this.files[0]);
    });
    $('.slider-mod > input[type=number]')
        .attr('disabled', '');

    editor_canvas = new p5(p5_init);
}

function p5_init(s: p5) {
    s.setup = () => {
        let p = $('#canvas');
        let w = p.width();
        let h = p.height();

        let cv = s.createCanvas(w, h);

        cv.parent('canvas');
        cv.elt.oncontextmenu = () => false;
        s.rectMode(s.CENTER);
        s.angleMode(s.DEGREES);
        s.frameRate(15);
    }

    s.draw = () => {
        let p = $('#canvas');
        let w = p.width()/2;
        let h = p.height()/2;
        s.background(60, 90, 190);
        s.fill(255, 50);
        for(let c of store.bobs) {
            let x = w+c.px/100*w;
            let y = h+c.py/100*h;
            s.push();
            s.translate(x, y);
            s.rotate(c.rot);
            s.stroke(200);
            s.strokeWeight(3);
            s.rect(0, 0, c.bw, c.bh);
            s.pop();
            s.push();
            s.translate(x, y);
            s.text(c.id, 0, 0);
            s.pop();
        }
    }

    s.windowResized = () => {
        let p = $('#canvas');
        let w = p.width();
        let h = p.height();
        s.resizeCanvas(w, h);
    }
}

$(document).ready($begin);
// test();


/////////////

/// App
let app = new Vue({
    el: '#mpane',
    data: store,
    methods: {

    }
});

/////////////

// ************** Generate the tree diagram	 *****************
// var margin = {top: 20, right: 40, bottom: 20, left: 40},
//     width = 800 - margin.right - margin.left,
//     height = 200 - margin.top - margin.bottom;
    
// var i = 0,
//     duration = 750,
//     root;

// var tree = d3.layout.tree()
//     .size([height, width]);

// var diagonal = d3.svg.diagonal()
//     .projection(function(d) { return [d.y, d.x]; });

// var svg = d3.select("#hpane").append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
// .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// root = store.hist0[0];
// root.x0 = height / 2;
// root.y0 = 0;

// update(root);

// d3.select(self.frameElement).style("height", "200px");

// function update(source) {

// // Compute the new tree layout.
// var nodes = tree.nodes(root).reverse(),
//     links = tree.links(nodes);

// // Normalize for fixed-depth.
// nodes.forEach(function(d) { d.y = d.depth * 180; });

// // Update the nodes…
// var node = svg.selectAll("g.hst-node")
//     .data(nodes, function(d) { return d.id || (d.id = ++i); });

// // Enter any new nodes at the parent's previous position.
// var nodeEnter = node.enter().append("g")
//     .attr("class", "hst-node")
//     .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
//     .on("click", click);

// nodeEnter.append("circle")
//     .attr("r", 1e-6)
//     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

// nodeEnter.append("text")
//     .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
//     .attr("dy", ".35em")
//     .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
//     .text(function(d) { return d.name; })
//     .style("fill-opacity", 1e-6);

// // Transition nodes to their new position.
// var nodeUpdate = node.transition()
//     .duration(duration)
//     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

// nodeUpdate.select("circle")
//     .attr("r", 10)
//     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

// nodeUpdate.select("text")
//     .style("fill-opacity", 1);

// // Transition exiting nodes to the parent's new position.
// var nodeExit = node.exit().transition()
//     .duration(duration)
//     .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
//     .remove();

// nodeExit.select("circle")
//     .attr("r", 1e-6);

// nodeExit.select("text")
//     .style("fill-opacity", 1e-6);

// // Update the links…
// var link = svg.selectAll("path.hst-link")
//     .data(links, function(d) { return d.target.id; });

// // Enter any new links at the parent's previous position.
// link.enter().insert("path", "g")
//     .attr("class", "hst-link")
//     .attr("d", function(d) {
//         var o = {x: source.x0, y: source.y0};
//         return diagonal({source: o, target: o});
//     });

// // Transition links to their new position.
// link.transition()
//     .duration(duration)
//     .attr("d", diagonal);

// // Transition exiting nodes to the parent's new position.
// link.exit().transition()
//     .duration(duration)
//     .attr("d", function(d) {
//         var o = {x: source.x, y: source.y};
//         return diagonal({source: o, target: o});
//     })
//     .remove();

// // Stash the old positions for transition.
// nodes.forEach(function(d) {
//     d.x0 = d.x;
//     d.y0 = d.y;
// });
// }

// // Toggle children on click.
// function click(d) {
// if (d.children) {
//     d._children = d.children;
//     d.children = null;
// } else {
//     d.children = d._children;
//     d._children = null;
// }
// update(d);
// }
  

