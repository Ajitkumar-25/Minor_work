const express = require("express");
const request = require("request");
const axios = require('axios');
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const questions = [
    "Why we need to do algorithm analysis?",
    "What are the criteria of algorithm analysis?",
    "What is asymptotic analysis of an algorithm?",
    "What are asymptotic notations?",
    "What is linear data structure?",
    "What are common operations that can be performed on a data-structure?",
    "Briefly explain the approaches to develop algorithms.",
    "What are some examples of divide and conquer algorithms?",
    "Why do we use stacks?",
    "What operations can be performed on Queues?",
    "What is linear searching?",
    "How insertion sort and selection sorts are different?",
    "How quick sort works?",
    "What is tree traversal?",
    "What is an AVL Tree?",
    "How many spanning trees can a graph has?",
    "What is a heap in data structure?",
    "What is a recursive function?",
    "What is interpolation search technique?",
    "What is the prefix and postfix notation of (a + b) * (c + d) ?",
    "Mention the features of ADT.",
    "Define List ADT.",
    "What is a circular linked list?",
    "What are the methods to implement stack in C?",
    "Define double-ended queue.",
    "Write the advantages of a threaded binary tree.",
    "How can a heap be used to represent a priority queue?",
    "Define biconnected graph.",
    "Define NP-Complete.",
    "What is a simple graph?",
  ];

  const answers = [
    "A problem can be solved in more than one ways. So, many solution algorithms can be derived for a given problem. We analyze available algorithms to find and implement the best suitable algorithm.",
    "An algorithm is generally analyzed on two factors time and space. That is, how much execution time and how much extra space required by the algorithm.",
    "Asymptotic analysis of an algorithm refers to defining the mathematical boundation/framing of its run time performance. Using asymptotic analysis, we can very well conclude the best case, average case, and worst-case scenario of an algorithm.",
    "Asymptotic analysis can provide three levels of mathematical binding of execution time of an algorithm  Best case is represented by Ω(n) notation. Worst case is represented by Ο(n) notation. Average case is represented by Θ(n) notation.",
    "A linear data structure has sequentially arranged data items. The next time can be located in the next memory address. It is stored and accessed in a sequential manner. Array and list are examples of linear data structures.",
    "The following operations are commonly performed on any data-structure: Insertion adding a data item; Deletion  removing a data item; Traversal accessing and/or printing all data items; Searching finding a particular data item; Sorting arranging data items in a pre-defined sequence.",
    "There are three commonly used approaches to develop algorithms  Greedy Approach  finding a solution by choosing the next best option; Divide and Conquer  dividing the problem to a minimum possible sub-problem and solving them independently; Dynamic Programming dividing the problem to a minimum possible sub-problem and solving them combinedly.",
    "The below-given problems find their solution using divide and conquer algorithm approach  Merge Sort; Quick Sort; Binary Search; Strassen's Matrix Multiplication; Closest pair (points).",
    "Stacks follow the LIFO method, and addition and retrieval of a data item take only Ο(n) time. Stacks are used where we need to access data in reverse order or their arrival. Stacks are used commonly in recursive function calls, expression parsing, depth-first traversal of graphs, etc.",
    "The below operations can be performed on a stack  enqueue()  adds an item to the rear of the queue; dequeue()  removes the item from the front of the queue; peek() gives the value of the front item without removing it; isempty() checks if the stack is empty; isfull() checks if the stack is full.",
    "Linear search tries to find an item in a sequentially arranged data type. These sequentially arranged data items known as an array or list, are accessible in incrementing memory location. Linear search compares expected data item with each of the data items in the list or array. The average-case time complexity of linear search is Ο(n) and worst-case complexity is Ο(n^2). Data in target arrays/lists need not be sorted.",
    "Both sorting techniques maintain two sub-lists, sorted and unsorted, and both take one element at a time and place it into the sorted sub-list. Insertion sort works on the current element in hand and places it in the sorted array at an appropriate location maintaining the properties of insertion sort. Whereas, selection sort searches the minimum from the",
    "Quick sort uses a divide and conquer approach. It divides the list into smaller 'partitions' using 'pivot'. The values which are smaller than the pivot are arranged in the left partition and greater values are arranged in the right partition. Each partition is recursively sorted using quick sort.",
    "Tree traversal is a process to visit all the nodes of a tree. Because, all nodes are connected via edges (links), we always start from the root (head) node. There are three ways which we use to traverse a tree In-order Traversal; Pre-order Traversal; Post-order Traversal.",
    "AVL trees are height balancing binary search trees. AVL tree checks the height of left and right sub-trees and assures that the difference is not more than 1. This difference is called the Balance Factor. BalanceFactor = height(left-subtree)  height(right-subtree).",
    "It depends on how connected the graph is. A complete undirected graph can have a maximum of nn-1 number of spanning trees, where n is the number of nodes.",
    "Heap is a special balanced binary tree data structure where the root-node key is compared with its children and arranged accordingly. A min-heap, a parent node has a key value less than its child's, and a max-heap parent node has a value greater than its child's.",
    "A recursive function is one that calls itself, directly or calls a function that in turn calls it. Every recursive function follows the recursive properties  base criteria where functions stop calling itself and progressive approach where the functions try to meet the base criteria in each iteration.",
    "Interpolation search is an improved variant of binary search. This search algorithm works on the probing position of the required value.",
    "Prefix Notation − * + a b + c d; Postfix Notation − a b + c d + *.",
    "a. Modularity i. Divide program into small functions ii. Easy to debug and maintain iii. Easy to modify; b. Reuse i. Define some operations only once and reuse them in the future; c. Easy to change the implementation.",
    "A list is a sequence of zero or more elements of a given type. The list is represented as a sequence of elements separated by a comma. A1, A2, A3…..AN Where N>0 and A is of type element.",
    "A circular linked list is a special type of linked list that supports traversing from the end of the list to the beginning by making the last node point back to the head of the list.",
    "The methods to implement stacks are: Array-based; Linked list-based.",
    "A double-ended queue is a special type of queue that allows insertion and deletion of elements at both ends.",
    "The difference between a binary tree and the threaded binary tree is that in the binary trees, the nodes are null if there is no child associated with it, and so there is no way to traverse back. But in a threaded binary tree, we have threads associated with the nodes, i.e., they are either linked to the predecessor or successor in the in-order traversal of the nodes. This helps us to traverse further or backward in the in-order traversal fashion.",
    "A priority queue is a different kind of queue, in which the next element to be removed is defined by (possibly) some other criterion. The most common way to implement a priority queue is to use a different kind of binary tree, called a heap. A heap avoids the long paths that can arise with binary search trees.",
    "A connected undirected graph is biconnected if there are no vertices whose removal disconnects the rest of the graph.",
    "NP is the class of decision problems for which a given proposed solution for a given input can be checked quickly to see if it is really a solution.",
    "A simple graph is a graph that has not more than one edge between a pair of nodes than such a graph is called a simple graph.",
  ];


app.use(express.json());
let rec;
app.get("/", function(req, res){
    res.render("home",{
        questions: questions,
        grade: -1,
        label: -1,
        similarityScore: -1,
        finalMarks: -1,
    });
    });

  app.post('/predict', async (req, res) => {
    let studentResp = req.body.studentResp;
    let sampleAns = req.body.sampleAns;
    const dataToSend = {
      studentResp: studentResp,
      sampleAns: sampleAns
    };

    console.log("data received", dataToSend);
    try {
      const response = await axios.post('http://127.0.0.1:5000/receive-data', dataToSend);
      console.log('Response from Flask server:', response.data);
      res.render("home", {
        grade: response.data['grade'],
        label: response.data['label'],
        similarityScore: response.data['similarity_score'],
        finalMarks: response.data['final_grade'],
        questions: questions
      });
    } catch (error) {
      console.error('Error sending data to Flask server:', error.message);
      res.status(500).json({ status: 'Failed to send data' });
    }
  });


app.listen(3000, function(){
    console.log("server is running on port 3000");
})