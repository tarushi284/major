#include <iostream>
#include <algorithm>
#include <iomanip>

using namespace std;

class Node {
public:
    int key;
    Node* left;
    Node* right;
    int height;

    Node(int value) {
        key = value;
        left = right = nullptr;
        height = 1;
    }
};

// Get height of node
int getHeight(Node* node) {
    if (!node) return 0;
    return node->height;
}

// Get balance factor
int getBalance(Node* node) {
    if (!node) return 0;
    return getHeight(node->left) - getHeight(node->right);
}

// Update height
void updateHeight(Node* node) {
    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
}

// Right rotate
Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;

    // Rotation
    x->right = y;
    y->left = T2;

    // Update heights
    updateHeight(y);
    updateHeight(x);

    return x;
}

// Left rotate
Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;

    // Rotation
    y->left = x;
    x->right = T2;

    // Update heights
    updateHeight(x);
    updateHeight(y);

    return y;
}

// Insert and balance
Node* insert(Node* node, int key) {
    if (!node) return new Node(key);

    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    else
        return node; // No duplicates

    updateHeight(node);

    int balance = getBalance(node);

    // LL case
    if (balance > 1 && key < node->left->key)
        return rightRotate(node);

    // RR case
    if (balance < -1 && key > node->right->key)
        return leftRotate(node);

    // LR case
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // RL case
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}

// Print tree (rotated for clarity)
void printTree(Node* root, int space = 0, int indent = 6) {
    if (!root) return;

    space += indent;
    printTree(root->right, space);

    cout << endl;
    for (int i = indent; i < space; i++)
        cout << " ";
    cout << root->key << " (BF=" << getBalance(root) << ")\n";

    printTree(root->left, space);
}

// Inorder traversal
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->key << " ";
    inorder(root->right);
}

int main() {
    Node* root = nullptr;
    int choice, val;

    while (true) {
        cout << "\n1. Insert\n2. Print Tree\n3. Inorder Traversal\n4. Exit\nEnter choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter value to insert: ";
                cin >> val;
                root = insert(root, val);
                break;
            case 2:
                printTree(root);
                break;
            case 3:
                cout << "Inorder: ";
                inorder(root);
                cout << endl;
                break;
            case 4:
                return 0;
            default:
                cout << "Invalid option.\n";
        }
    }

    return 0;
}
