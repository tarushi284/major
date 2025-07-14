const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// 🌱 Node class
class Node {
  constructor(value) {
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

// 🌳 AVL Tree class
class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  rightRotate(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node; // Duplicate not allowed

    this.updateHeight(node);

    let balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) return this.rightRotate(node);
    if (balance < -1 && value > node.right.value) return this.leftRotate(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  insertValue(value) {
    this.root = this.insert(this.root, value);
    drawTree();
  }

  // 🗑️ DELETE FUNCTIONALITY
  deleteValue(value) {
    this.root = this.deleteNode(this.root, value);
    drawTree();
  }

  deleteNode(root, key) {
    if (!root) return root;

    if (key < root.value)
      root.left = this.deleteNode(root.left, key);
    else if (key > root.value)
      root.right = this.deleteNode(root.right, key);
    else {
      // Node found
      if (!root.left || !root.right) {
        let temp = root.left ? root.left : root.right;
        return temp || null;
      } else {
        let temp = this.getMinValueNode(root.right);
        root.value = temp.value;
        root.right = this.deleteNode(root.right, temp.value);
      }
    }

    this.updateHeight(root);

    let balance = this.getBalance(root);

    if (balance > 1 && this.getBalance(root.left) >= 0)
      return this.rightRotate(root);

    if (balance > 1 && this.getBalance(root.left) < 0) {
      root.left = this.leftRotate(root.left);
      return this.rightRotate(root);
    }

    if (balance < -1 && this.getBalance(root.right) <= 0)
      return this.leftRotate(root);

    if (balance < -1 && this.getBalance(root.right) > 0) {
      root.right = this.rightRotate(root.right);
      return this.leftRotate(root);
    }

    return root;
  }

  getMinValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }
}

// 🧠 Initialize Tree
let tree = new AVLTree();

// 🌿 Insert Button Handler
function insertNode() {
  let val = parseInt(document.getElementById("nodeValue").value);
  if (!isNaN(val)) {
    tree.insertValue(val);
    document.getElementById("nodeValue").value = "";
  }
}

// ❌ Delete Button Handler
function deleteNode() {
  let val = parseInt(document.getElementById("nodeValue").value);
  if (!isNaN(val)) {
    tree.deleteValue(val);
    document.getElementById("nodeValue").value = "";
  }
}

// 🔁 Reset Button Handler
function resetTree() {
  tree = new AVLTree();
  drawTree();
}

// 🖼️ Draw Tree on Canvas
function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNode(tree.root, canvas.width / 2, 40, canvas.width / 4);
}

// 📍 Recursive Node Drawing
function drawNode(node, x, y, spacing) {
  if (!node) return;

  // Draw line to left child
  if (node.left) {
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x - spacing, y + 60);
    ctx.stroke();
    drawNode(node.left, x - spacing, y + 60, spacing / 1.5);
  }

  // Draw line to right child
  if (node.right) {
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + spacing, y + 60);
    ctx.stroke();
    drawNode(node.right, x + spacing, y + 60, spacing / 1.5);
  }

  // Draw the node circle
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#4caf50";
  ctx.fill();
  ctx.stroke();

  // Draw node value
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(node.value, x, y + 5);
}
