
/**
 * @description This class creates the drawing canvas on the screen
 * @description Call obj.canvas to get the generated canvas reference
 */
export class Drawing {
    canvas; context; width; height;
    cursor = { x: 0, y: 0 };

    constructor(backgroundColor) {
        document.body.backgroundColor = "black";
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.height = window.innerWidth;
        this.width = window.innerHeight;
        //this.canvas.style.width = "100vw";
        //this.canvas.style.height = "auto";
        //this.canvas.style.display = "block";
        //this.canvas.style.aspectRatio = "16/9";
        this.canvas.style.position = "fixed";
        this.canvas.style.backgroundColor = backgroundColor;
        this.canvas.style.margin = "0 auto";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";

        this.container = this.canvas.getContext("2d");

        window.addEventListener("resize", e => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.height = window.innerWidth;
            this.width = window.innerHeight;
        });
        window.addEventListener("mousemove", e => {
            const rect = this.canvas.getBoundingClientRect();
            this.cursor.x = e.clientX - rect.left;
            this.cursor.y = e.clientY - rect.top;
        });

        document.body.appendChild(this.canvas);
    }

    // #region Drawing resources

    blendModes = {
        normal: "normal",
        multiply: "multiply",
        screen: "screen",
        overlay: "overlay",
        darken: "darken",
        lighten: "lighten",
        colorDodge: "color-dodge",
        colorBurn: "color-burn",
        hardLight: "hard-light",
        softLight: "soft-light",
        difference: "difference",
        exclusion: "exclusion",
        hue: "hue",
        saturation: "saturation",
        color: "color",
        luminosity: "luminosity",
    }

    filters = {
        blur: "blur",
        linearGradient: (canvas, x0, y0, x1, y1, colorStops = [[0, "red"], [1, "blue"]]) => {
            this.context = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            colorStops.forEach(([offset, color]) => {
                gradient.addColorStop(offset, color);
            });
            return gradient;
        },
    }

    //#endregion

    // #region Drawing static geometries

    /**
     * @description Draws **static** 2D bezier paths
     * @param {string} svgData 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawPath("M20 20 l 200 0 l 0 100 l -200 0 Z", "red", "black", 5, [15, 5])
     */
    drawPath(svgData, fillColor, strokeColor, lineWidth, lineDash = []) {
        let posX, posY;
        if (svgData.startsWith("M ")) {
            posX = svgData.replace("M ", "").split(" ")[0];
            posY = svgData.replace("M ", "").split(" ")[0];
        } else {
            posX = svgData.replace("M", "").split(" ")[0];
            posY = svgData.replace("M", "").split(" ")[0];
        }
        return new Path(this.canvas, svgData, fillColor, strokeColor, lineWidth, lineDash)
    }

    /**
     * Draws a **static** poligon
     * @param {number} sides 
     * @param {number} radius 
     * @param {number} x 
     * @param {number} y 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawPoligon(5, 100, 350, 100, "red", "black", 5, [0])
     */
    drawPoligon(sides, radius, x, y, fillColor, strokeColor, lineWidth, lineDash = []) {
        let pathData = "";
        for (let i = 0; i < sides; i++) {
            const angle = (2 * Math.PI * i) / sides;
            const x_i = x + radius * Math.cos(angle);
            const y_i = y + radius * Math.sin(angle);
            pathData += (i === 0 ? `M ${x_i} ${y_i} ` : `L ${x_i} ${y_i} `);
        }
        pathData += "Z";
        //
        return new Path(this.canvas, pathData, fillColor, strokeColor, lineWidth, lineDash);
    }

    /**
     * Draws a **static** star
     * @param {number} points 
     * @param {number} radius 
     * @param {number} aperture aperture factor --> 0: bold, 1: thin, 0.5: normal
     * @param {number} x 
     * @param {number} y 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawStar(5, 100, .5, 650, 100, "green", "black", 5, [0]);
     */
    drawStar(points, radius, aperture, x, y, fillColor, strokeColor, lineWidth, lineDash = []) {
        const innerRadius = (radius * (1 - aperture));
        let pathData = "";
        for (let i = 0; i < points * 2; i++) {
            const angle = (Math.PI * i) / points;
            const r = i % 2 === 0 ? radius : innerRadius;
            const x_i = x + r * Math.cos(angle);
            const y_i = y + r * Math.sin(angle);
            pathData += (i === 0 ? `M ${x_i} ${y_i} ` : `L ${x_i} ${y_i} `);
        }
        pathData += "Z";
        //
        return new Path(this.canvas, pathData, fillColor, strokeColor, lineWidth, lineDash);
    }

    /**
     * Draws a **static** rectangle
     * @param {number} width 
     * @param {number} height 
     * @param {number} x 
     * @param {number} y 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawRectangle(200, 100, 20, 250, "blue", "black", 5, [0]);
     */
    drawRectangle(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash = []) {
        const pathData = `M ${x} ${y} h ${width} v ${height} h -${width} Z`;
        return new Path(this.canvas, pathData, fillColor, strokeColor, lineWidth, lineDash);
    }

    /**
     * Draws a **static** circle
     * @param {number} radius 
     * @param {number} x 
     * @param {number} y 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawCircle(75, 350, 300, "#ffbb00", "black", 5, [0]);
     */
    drawCircle(radius, x, y, fillColor, strokeColor, lineWidth, lineDash = []) {
        const pathData = `M ${x + radius} ${y} A ${radius} ${radius} 0 1 0 ${x - radius} ${y} A ${radius} ${radius} 0 1 0 ${x + radius} ${y} Z`;
        return new Path(this.canvas, pathData, fillColor, strokeColor, lineWidth, lineDash);
    }

    /**
     * Draws a **static** ellipse
     * @param {number} width 
     * @param {number} height 
     * @param {number} x 
     * @param {number} y 
     * @param {string} fillColor 
     * @param {string} strokeColor 
     * @param {number} lineWidth 
     * @param {number[]} lineDash 
     * @returns Path
     * @example drawEllipse(200, 100, 650, 350, "rgba(128, 0, 128, 0.5)", "black", 5, [5]);
     */
    drawEllipse(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash = []) {
        const rx = width / 2;
        const ry = height / 2;
        const pathData = `M ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} Z`;
        return new Path(this.canvas, pathData, fillColor, strokeColor, lineWidth, lineDash);
    }

    //#endregion

    // #region  Drawing functions

    /**
     * @description Asynchronously loads an image that can be rendered
     * @param {string} url 
     * @param {number} posX 
     * @param {number} posY 
     * @param {number} width 
     * @param {number} height 
     * @returns Picture
     */
    loadImage(url, posX, posY, width, height) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = e => {
                resolve(new Picture(this.canvas, img, posX, posY, width, height))
            }
        });
    }

    loadAudio(url) {
        return new Promise(async (resolve, reject) => {
            resolve();
        });
    }

    loadContent(url) {
        return new Promise(async (resolve, reject) => {
            resolve();
        });
    }

    /**
     * @description Creates a Text object that can be rendered in the gameloop
     * @param {string} text Text to be rendered
     * @param {string} textStyle "normal | bold | italic"
     * @param {string} fontSize CSS fontsize string --> "12pt"
     * @param {string} fontFamily CSS fontfamily string --> "sans-serif"
     * @param {string} fontColor CSS colostring --> "#001122"
     * @param {number} posX 
     * @param {number} posY 
     * @returns Text
     */
    writeText(text, textStyle = "normal", fontSize = "12pt", fontFamily = "sans-serif", fontColor = "black", posX, posY) {
        return new Text(this.canvas, text, textStyle, fontSize, fontFamily, fontColor, posX, posY);
    }

    //#endregion
}

class Scene {
    children = {};
    constructor() { }
    add(node) {
        this.children[node.name] = node;
        node.parent = this;
    }
    remove(node) {
        node.parent = null;
        delete this.children[node.name];
    }
}

class Node {
    name;
    children = {};
    parent = null;
    constructor() { }
    add(node) {
        this.children[node.name] = node;
        node.parent = this;
    }
    remove(node) {
        node.parent = null;
        delete this.children[node.name];
    }
}

class GameObject extends Node {
    canvas;
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }
    properties = {
        transformations: [],
        animations: [],
        filters: [],
    };
    transform = {
        move: (x, y) => {
            //
        },
        scale: (factor) => {
            //
        },
        rotate: (degrees) => {
            const ctx = this.canvas.getContext("2d");
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radians = degrees * (Math.PI / 180);
            ctx.save();

            ctx.translate(centerX, centerY);
            ctx.rotate(radians);

            ctx.restore();
        },
        mirror: (x, y) => { },
        skew: (x, y) => { },
        inflate: (factor) => { },
        deflate: (factor) => { },
        opacity: (factor) => { },
        saturation: (factor) => { },
        brightness: (factor) => { },
        invertColor: (factor) => { },
        filter: (filterName, factor) => { },
        blend: (blendModeName, factor) => { },
    };
    animate = {
        move: (x, y, durationMs = 1000, repeat = 1) => { },
        scale: (factor, durationMs = 1000, repeat = 1) => { },
        rotate: (degrees, durationMs = 1000, repeat = 1) => { },
        mirror: (x, y, durationMs = 1000, repeat = 1) => { },
        skew: (x, y, durationMs = 1000, repeat = 1) => { },
        inflate: (factor, durationMs = 1000, repeat = 1) => { },
        deflate: (factor, durationMs = 1000, repeat = 1) => { },
        opacity: (factor, durationMs = 1000, repeat = 1) => { },
        saturation: (factor, durationMs = 1000, repeat = 1) => { },
        brightness: (factor, durationMs = 1000, repeat = 1) => { },
        invertColor: (factor, durationMs = 1000, repeat = 1) => { },
    };
}

export class Path {
    canvas; svgData; fillColor; strokeColor; lineWidth; lineDash;
    constructor(canvas, svgData, fillColor, strokeColor, lineWidth, lineDash) {
        this.canvas = canvas;
        this.svgData = svgData;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
        this.lineDash = lineDash;
    }
    render() {
        const path = new Path2D(this.svgData);
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.fillColor;
        ctx.fill(path);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash(this.lineDash);
        ctx.stroke(path);
    };
}

export class Picture extends GameObject {
    posX; posY; width; height; img; canvas;
    constructor(canvas, img, posX, posY, width, height) {
        super(canvas);
        this.canvas = canvas;
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.width = width || null;
        this.height = height || null;
    }

    render() {
        const ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.scale(this.canvas.width / 100, this.canvas.height / 100);

        ctx.drawImage(this.img, this.posX, this.posY, this.width || img.width, this.height || img.height);

        ctx.restore();
    }

    replace(url) {
        const newImg = new Image();
        newImg.src = url;
        newImg.onload = e => {
            this.img = newImg;
        }
    }
}

export class Text extends GameObject {
    text; textStyle; fontSize; fontFamily; fontColor; posX; posY; canvas;

    constructor(canvas, text, textStyle, fontSize, fontFamily, fontColor, posX, posY) {
        super();
        this.canvas = canvas;
        this.text = text;
        this.textStyle = textStyle;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fontColor = fontColor;
        this.posX = posX;
        this.posY = posY;
    }

    render() {
        const ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.scale(this.canvas.width / 100, this.canvas.height / 100);

        this.properties.animations.forEach(x => { });
        this.properties.filters.forEach(x => { });
        this.properties.transformations.forEach(x => { });

        ctx.font = this.textStyle + " " + this.fontSize + " " + this.fontFamily;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.fontColor;
        ctx.textRendering
        ctx.fillText(this.text, this.posX, this.posY);

        ctx.restore();
    }
}

export class Game {
    startTime; updateTime; deltaTime; canvas;
    scene = new Scene();

    constructor(canvas) {
        this.startTime = Date.now();
        this.updateTime = this.startTime; // Opcional: inicializar `updateTime` no construtor
        this.deltaTime = 0;
        this.canvas = canvas;
    }

    onUpdate(gameLoopCallback = () => { }) {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateTime = Date.now();
        this.deltaTime = this.updateTime - this.startTime;
        this.startTime = this.updateTime; // Atualiza `startTime` para o próximo cálculo de delta

        gameLoopCallback(this.deltaTime); // Chama o callback e passa deltaTime como argumento

        requestAnimationFrame(() => this.onUpdate(gameLoopCallback));
    }
}

class UI { }
