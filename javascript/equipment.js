let ItemStoredCopy = document.getElementById("ItemStoredClone")
initializePage()

async function initializePage() {
    // let Items = sessionStorage.getItem("Items")
    // if (Items) {
    //     try {
    //         Items = JSON.parse(Items);
    //     } catch (error) {
    //         Items = [];
    //     }
    // } 
    // else {
    //     Items = [];
    // }

    // await GetAllItems()

    // console.log(Items)

    let Items = document.getElementsByClassName("Item")

    let ArsenalBox = document.getElementById("Arsenal_Right")
    let UniformBox = document.getElementById("uniformBox")

    for(Item of Items) {
        Item.addEventListener("dragstart", function(e) {
            let Selected = e.target;
            Selected.classList.add("dragging");
        })

        Item.addEventListener("dragend", function(e) {
            let Selected = e.target;
            Selected.classList.remove("dragging");
        })
    }

    // Uniform Box
    UniformBox.addEventListener("dragenter", function() {
        UniformBox.style.backgroundColor = "#262f3c";
    });

    UniformBox.addEventListener("dragleave", function() {
        UniformBox.style.backgroundColor = "#202833";
    });


    UniformBox.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    UniformBox.addEventListener("drop", function(e) {
        e.preventDefault();

        UniformBox.style.backgroundColor = "#202833";

        PlaceNewItem(UniformBox)
    })

    ArsenalBox.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    ArsenalBox.addEventListener("drop", function(e) {
        e.preventDefault();

        let Selected = document.querySelector(".dragging")
        if (!ArsenalBox.contains(Selected))
            Selected.remove()
    })
}

// Functions
function PlaceNewItem(Box)
{
    let Selected = document.querySelector(".dragging");
    let CheckIfExists = Box.querySelector(`#${Selected.id}`)

    if (!CheckIfExists) {
        let ItemImg = Selected.children[0].children[0].src
        let ItemTitle = Selected.children[1].children[0].textContent

        let NewItem = ItemStoredCopy.cloneNode(true);
        NewItem.id = Selected.id

        let NewItemImg = NewItem.children[1].children[0]
        NewItemImg.src = ItemImg

        let NewItemTitle = NewItem.children[2].children[0]
        NewItemTitle.textContent = ItemTitle

        NewItem.style.display = "flex"
        Box.appendChild(NewItem)

        Selected.classList.remove("dragging");

        AddingEventLisener(NewItem)
        AddBtnsLiseners(NewItem)
    }

    else {
        let AmountTxtElement = CheckIfExists.children[2].children[1];
        let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);
        amount++;
    
        AmountTxtElement.textContent = `כמות - ${amount}`;
    }
}

function AddingEventLisener(Item)
{
    Item.addEventListener("dragstart", function(e) {
        let Selected = e.target;
        Selected.classList.add("dragging");
    })

    Item.addEventListener("dragend", function(e) {
        let Selected = e.target;
        Selected.classList.remove("dragging");
    })
}

function AddBtnsLiseners(Item)
{
    let Buttons = Item.children[0]
    Buttons.children[0].addEventListener("click", function() {
        IncreseItem(Item)
    })
    Buttons.children[1].addEventListener("click", function() {
        DecreseItem(Item)
    })
}

async function GetAllItems() {
    try {
        const response = await fetch(`https://icf-api-ten.vercel.app/GetAllItems`);
        const data = await response.json();

        if (data.results) {
            sessionStorage.setItem("Items", JSON.stringify(data.results))
            Items = data.results
        }
    }
    catch (error) {
        return
    }
}

function IncreseItem(Item)
{
    let AmountTxtElement = Item.children[2].children[1];
    let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);
    amount++;
    
    AmountTxtElement.textContent = `כמות - ${amount}`;
}

function DecreseItem(Item)
{
    let AmountTxtElement = Item.children[2].children[1];
    let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);
    amount--;
    
    if (!amount)
        Item.remove();

    AmountTxtElement.textContent = `כמות - ${amount}`;
}