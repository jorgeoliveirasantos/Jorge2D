# Documentação da Biblioteca Jorge2D

A biblioteca **Jorge2D** fornece uma camada de abstração sobre a API Canvas do HTML5, facilitando a criação de formas geométricas, imagens, textos e a estruturação de cenas para jogos ou animações 2D. Ela inclui classes para gerenciar o canvas, desenhar objetos estáticos, carregar recursos e criar um loop de atualização (game loop).

---

## Índice

1. [Instalação e Uso Básico](#instalação-e-uso-básico)
2. [Classe `Drawing`](#classe-drawing)
   - [Construtor](#construtor)
   - [Propriedades](#propriedades)
   - [Métodos para desenho estático](#métodos-para-desenho-estático)
   - [Carregamento de imagem](#carregamento-de-imagem)
   - [Escrita de texto](#escrita-de-texto)
3. [Classe `Game` e o Game Loop](#classe-game-e-o-game-loop)
4. [Objetos Renderizáveis](#objetos-renderizáveis)
   - [`Path`](#path)
   - [`Picture`](#picture)
   - [`Text`](#text)
5. [Hierarquia de Cena (Experimental)](#hierarquia-de-cena-experimental)
6. [Observações e Limitações](#observações-e-limitações)

---

## Instalação e Uso Básico

A biblioteca é fornecida como um módulo ES6. Para usá-la em seu projeto, importe as classes necessárias:

```javascript
import { Drawing, Game, Path, Picture, Text } from './Jorge2D.js';
```

Em seguida, crie uma instância de `Drawing` para obter o canvas e, opcionalmente, um objeto `Game` para controlar o loop de animação.

```javascript
const canvasApp = new Drawing('black'); // fundo preto
document.body.appendChild(canvasApp.canvas); // já é anexado automaticamente
```

---

## Classe `Drawing`

A classe `Drawing` é responsável por criar e gerenciar o elemento `<canvas>`, além de fornecer métodos para desenhar formas estáticas e carregar recursos.

### Construtor

```javascript
new Drawing(backgroundColor)
```

- **backgroundColor** (string): cor de fundo do canvas (qualquer valor CSS válido).

O construtor cria o canvas, define seu tamanho como `window.innerWidth` x `window.innerHeight`, aplica estilos posicionais e o anexa ao `document.body`. Também registra eventos de redimensionamento e movimento do mouse.

### Propriedades

- `canvas` – referência ao elemento `<canvas>`.
- `context` – contexto 2D do canvas.
- `width`, `height` – dimensões do canvas (nota: no código atual há uma troca entre largura/altura, veja [Observações](#observações-e-limitações)).
- `cursor` – objeto `{ x, y }` contendo a posição do mouse relativa ao canvas.
- `blendModes` – objeto com os modos de composição suportados (valores para uso com `ctx.globalCompositeOperation`).
- `filters` – objeto com métodos auxiliares para filtros (apenas `linearGradient` esboçado).

### Métodos para desenho estático

Todos os métodos abaixo retornam uma instância de [`Path`](#path). O desenho só ocorre quando o método `render()` do objeto for chamado (normalmente dentro do game loop).

#### `drawPath(svgData, fillColor, strokeColor, lineWidth, lineDash)`
Desenha um caminho SVG arbitrário.
- **svgData** (string): dados do caminho no formato SVG (ex: `"M20 20 l200 0 l0 100 l-200 0 Z"`).
- **fillColor**, **strokeColor** (string): cores CSS.
- **lineWidth** (number): espessura do traço.
- **lineDash** (array): padrão de traço‑pontilhado (ex: `[15,5]`).

#### `drawPoligon(sides, radius, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Desenha um polígono regular.
- **sides** (number): número de lados.
- **radius** (number): distância do centro aos vértices.
- **x, y** (number): coordenadas do centro.

#### `drawStar(points, radius, aperture, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Desenha uma estrela.
- **points** (number): número de pontas.
- **radius** (number): raio externo.
- **aperture** (number): fator de abertura (0 → bold, 1 → fino, 0.5 → normal).
- **x, y** (number): centro.

#### `drawRectangle(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Desenha um retângulo.
- **width, height** (number): dimensões.
- **x, y** (number): canto superior esquerdo.

#### `drawCircle(radius, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Desenha um círculo.
- **radius** (number): raio.
- **x, y** (number): centro.

#### `drawEllipse(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Desenha uma elipse.
- **width, height** (number): largura e altura totais.
- **x, y** (number): centro.

### Carregamento de imagem

#### `loadImage(url, posX, posY, width, height)`
Carrega uma imagem de forma assíncrona e retorna uma `Promise` que resolve para um objeto [`Picture`](#picture).
- **url** (string): caminho da imagem.
- **posX, posY** (number): posição no canvas.
- **width, height** (number): dimensões de exibição (se omitido, usa as dimensões originais).

Exemplo:
```javascript
const minhaImg = await desenho.loadImage('foto.jpg', 100, 50, 200, 150);
```

### Escrita de texto

#### `writeText(text, textStyle, fontSize, fontFamily, fontColor, posX, posY)`
Cria um objeto [`Text`](#text) que pode ser renderizado.
- **text** (string): conteúdo.
- **textStyle** (string): `"normal"`, `"bold"`, `"italic"`.
- **fontSize** (string): tamanho no formato CSS (ex: `"12pt"`, `"16px"`).
- **fontFamily** (string): família da fonte.
- **fontColor** (string): cor CSS.
- **posX, posY** (number): posição do centro do texto.

---

## Classe `Game` e o Game Loop

A classe `Game` implementa um loop de animação básico.

```javascript
const jogo = new Game(canvasApp.canvas);
jogo.onUpdate((deltaTime) => {
    // limpeza automática do canvas já é feita
    // desenhe seus objetos aqui
});
```

### Construtor

```javascript
new Game(canvas)
```
- **canvas** – referência ao elemento `<canvas>` (obtido de `Drawing.canvas`).

### Métodos

#### `onUpdate(gameLoopCallback)`
Inicia o loop de animação. O callback recebe `deltaTime` (diferença em ms desde o último frame) e é executado a cada quadro. Antes de chamar o callback, o canvas é completamente limpo (`clearRect`).

---

## Objetos Renderizáveis

Os objetos retornados pelos métodos de desenho devem ser renderizados explicitamente através do método `render()`. Eles podem ser armazenados e reutilizados a cada quadro.

### `Path`

Representa uma forma geométrica definida por um caminho SVG.

#### Propriedades
- `canvas`, `svgData`, `fillColor`, `strokeColor`, `lineWidth`, `lineDash`.

#### Métodos
- `render()` – desenha o caminho no canvas.

### `Picture`

Representa uma imagem.

#### Construtor (não usado diretamente)
Normalmente criado via `Drawing.loadImage()`.

#### Propriedades
- `img` – objeto `Image` carregado.
- `posX`, `posY`, `width`, `height`.

#### Métodos
- `render()` – desenha a imagem.
- `replace(url)` – substitui a imagem por outra (carregamento assíncrono).

### `Text`

Representa um texto.

#### Construtor (não usado diretamente)
Criado via `Drawing.writeText()`.

#### Propriedades
- `text`, `textStyle`, `fontSize`, `fontFamily`, `fontColor`, `posX`, `posY`.
- `properties` – objeto para futuras transformações/animacões.

#### Métodos
- `render()` – desenha o texto centralizado na posição especificada.

---

## Hierarquia de Cena (Experimental)

As classes `Scene`, `Node` e `GameObject` estão parcialmente implementadas e sugerem uma estrutura de árvore para organizar os elementos do jogo. No estado atual, apenas `Picture` herda de `GameObject`, mas os métodos de transformação (`transform`, `animate`) estão vazios ou incompletos. Recomenda‑se não utilizá‑los até que sejam devidamente implementados.

---

## Observações e Limitações

1. **Dimensões do canvas**  
   No construtor de `Drawing`, as propriedades `width` e `height` estão invertidas:  
   `this.height = window.innerWidth;` e `this.width = window.innerHeight;`.  
   Isso pode causar comportamento inesperado ao usar coordenadas baseadas nessas propriedades. Sugere‑se corrigir para:  
   ```javascript
   this.width = window.innerWidth;
   this.height = window.innerHeight;
   ```

2. **Transformações e animações**  
   Os métodos de `transform` e `animate` nas classes `GameObject`, `Picture` e `Text` estão apenas esboçados (corpos vazios ou com implementação incompleta). Não há suporte real para rotação, escala, etc. no momento.

3. **Filtros e modos de blend**  
   O objeto `filters` contém apenas um método `linearGradient` que não está funcional (usa `ctx` não definido). Os modos de blend estão listados, mas não são aplicados automaticamente.

4. **Carregamento de áudio/conteúdo**  
   Os métodos `loadAudio` e `loadContent` estão presentes mas não implementados.

5. **Classe UI**  
   Está definida mas vazia.

6. **Uso do `scale` em `Picture.render` e `Text.render`**  
   Há um `ctx.scale(this.canvas.width / 100, this.canvas.height / 100)` que parece tentar criar um sistema de coordenadas normalizado (0‑100), mas isso interfere nas coordenadas fornecidas. Se não for intencional, remova ou ajuste.

7. **Evento `resize`**  
   Ao redimensionar a janela, o canvas é redimensionado, mas as dimensões internas `width`/`height` continuam trocadas.

---

## Exemplo Completo

```javascript
import { Drawing, Game } from './Jorge2D.js';

(async () => {
    // Cria o canvas
    const desenho = new Drawing('#111');
    
    // Aguarda carregamento de uma imagem
    const logo = await desenho.loadImage('logo.png', 50, 50, 100, 100);
    
    // Cria formas estáticas
    const retangulo = desenho.drawRectangle(200, 100, 150, 200, 'rgba(255,0,0,0.5)', 'white', 2);
    const circulo = desenho.drawCircle(60, 400, 250, 'blue', 'yellow', 4, [10,5]);
    const texto = desenho.writeText('Olá, Jorge2D!', 'bold', '24pt', 'Arial', 'lime', 300, 100);
    
    // Inicia o game loop
    const jogo = new Game(desenho.canvas);
    jogo.onUpdate((dt) => {
        // Renderiza todos os objetos (a limpeza do canvas é automática)
        logo.render();
        retangulo.render();
        circulo.render();
        texto.render();
    });
})();
```

---

Esta documentação cobre o estado atual da biblioteca. Para contribuições ou correções, considere ajustar os pontos listados em [Observações](#observações-e-limitações).
