let ItemStoredCopy = document.getElementById("ItemStoredClone")
let ItemArsenalCopy = document.getElementById("ItemArsenalCopy")
let MainItemClone = document.getElementById("MainItemClone")

let Arsenal_Right = document.getElementById("Arsenal_Right")
let UniformBox = document.getElementById("uniformBox")
let VestBox = document.getElementById("vestBox")
let backpackBox = document.getElementById("backpackBox")

let UniformItem = document.getElementById("UniformItem")
let VestItem = document.getElementById("VestItem")
let BackpackItem = document.getElementById("BackpackItem")

let MainInvBoxes = ["uniformBox", "vestBox", "backpackBox"];
let MainInvItems = ["UniformItem", "VestItem", "BackpackItem"]
let MainItemsType = ["Uniform", "Vest", "Backpack"]

let IsShiftDown = false

initializePage()

async function initializePage() {
    let Items = sessionStorage.getItem("Items")
    if (Items) {
        try {
            Items = JSON.parse(Items);
        } catch (error) {
            Items = [];
        }
    } 
    else {
        Items = [];
    }

    await GetAllItems()

    console.log(Items)

    let Ars_WeaponsBtn = document.getElementById("Ars_Weapons")
    let Ars_AttachmentsBtn = document.getElementById("Ars_Attachments")
    let Ars_MainItemsBtn = document.getElementById("Ars_MainItems")
    let Ars_ClothingBtn = document.getElementById("Ars_Clothing")
    let Ars_ItemsBtn = document.getElementById("Ars_Items")

    Ars_WeaponsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_WeaponsBtn.value))
    }

    Ars_AttachmentsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_AttachmentsBtn.value))
    }

    Ars_MainItemsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_MainItemsBtn.value))
    }

    Ars_ClothingBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_ClothingBtn.value))
    }

    Ars_ItemsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_ItemsBtn.value))
    }

    AddingBIEventLisener(MainInvBoxes, MainInvItems, MainItemsType)

    // Arsenal
    Arsenal_Right.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    Arsenal_Right.addEventListener("drop", function(e) {
        e.preventDefault();

        let Selected = document.querySelector(".dragging")

        if (UniformBox.contains(Selected))
        {
            let AmountTxtElement = Selected.children[2].children[1];
            let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);

            let ItemData;

            for (CurrectItem of Items) {
                if (CurrectItem.ItemId == Selected.id) {
                    ItemData = CurrectItem
                    break
                }
            }

            let MainItem = Selected.parentElement.parentElement.children[0].children[1]

            MainItem.dataset.currectweight = Number(MainItem.dataset.currectweight) - (amount * ItemData.Weight)
        }

        if (VestBox.contains(Selected)) {
            let AmountTxtElement = Selected.children[2].children[1];
            let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);

            let ItemData;

            for (CurrectItem of Items) {
                if (CurrectItem.ItemId == Selected.id) {
                    ItemData = CurrectItem
                    break
                }
            }

            let MainItem = Selected.parentElement.parentElement.children[0].children[1]

            MainItem.dataset.currectweight = Number(MainItem.dataset.currectweight) - (amount * ItemData.Weight)
        }

        if (UniformItem.contains(Selected)) {
            UniformBox.innerHTML = ""
        }

        if (VestItem.contains(Selected)) {
            VestBox.innerHTML = ""
        }

        if (BackpackItem.contains(Selected)) {
            backpackBox.innerHTML = ""
        }

        if (!Arsenal_Right.contains(Selected))
            Selected.remove()
    })

    document.addEventListener("keydown", function(event) {
        if (event.key === "Shift") {
            IsShiftDown = true;
        }
    });
    
    document.addEventListener("keyup", function(event) {
        if (event.key === "Shift") {
            IsShiftDown = false;
        }
    });
}

// Functions
function PlaceNewItem(Box, AllowItems)
{
    let Selected = document.querySelector(".dragging");

    if (Box.contains(Selected))
        return

    for (Item of Items)
    {
        if (Item.ItemId === Selected.id)
        {
            let flag = false
            for (let i = 0; i < AllowItems.length; i++)
            {
                if (Item.Type === AllowItems[i])
                {
                    flag = true
                    break
                }
            }

            if (flag)
            {
                let CheckIfExists = Box.querySelector(`#${Selected.id}`)

                let MainItem = Box.parentElement.children[0].children[1]

                if (Number(MainItem.dataset.currectweight) + Item.Weight > Number(MainItem.dataset.space))
                {
                    return
                }

                MainItem.dataset.currectweight = Number(MainItem.dataset.currectweight) + Item.Weight

                if (!CheckIfExists) {
                    let NewItem = ItemStoredCopy.cloneNode(true);
                    NewItem.id = Selected.id

                    let NewItemImg = NewItem.children[1].children[0]
                    NewItemImg.src = Item.Image

                    let NewItemTitle = NewItem.children[2].children[0]
                    NewItemTitle.textContent = Item.Title

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
        }
    }
}

function PlaceNewMainItem(Box, AllowItem)
{
    let Selected = document.querySelector(".dragging");

    for (Item of Items)
        {
            if (Item.ItemId === Selected.id && Item.Type === AllowItem)
            {
                MainItemC = MainItemClone.cloneNode(false);

                MainItemC.id = Item.ItemId
                MainItemC.src = Selected.children[0].children[0].src

                MainItemC.style.display = "block"

                MainItemC.dataset.currectweight = 0
                MainItemC.dataset.space = Item.Space

                Box.appendChild(MainItemC)

                AddingEventLisener(MainItemC)

                break
            }
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

    let MainItem = Item.parentElement.parentElement.children[0].children[1]

    let currectweight = MainItem.dataset.currectweight
    let space = MainItem.dataset.space

    let ItemData;

    for (CurrectItem of Items) {
        if (CurrectItem.ItemId == Item.id) {
            ItemData = CurrectItem
            break
        }
    }

    if (IsShiftDown) {
        if (Number(currectweight) + (ItemData.Weight * 5) > Number(space))
            return

        amount+= 5;
        MainItem.dataset.currectweight = Number(currectweight) + (ItemData.Weight * 5)
    }
    else {
        if (Number(currectweight) + ItemData.Weight > Number(space))
            return

        amount++;
        MainItem.dataset.currectweight = Number(currectweight) + ItemData.Weight
    }
    
    
    AmountTxtElement.textContent = `כמות - ${amount}`;
}

function DecreseItem(Item)
{
    let AmountTxtElement = Item.children[2].children[1];
    let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);

    let MainItem = Item.parentElement.parentElement.children[0].children[1]
    let currectweight = MainItem.dataset.currectweight

    console.log(currectweight)

    let ItemData;

    for (CurrectItem of Items) {
        if (CurrectItem.ItemId == Item.id) {
            ItemData = CurrectItem
            break
        }
    }

    if (IsShiftDown) {
        amount-= 5;

        MainItem.dataset.currectweight = Number(currectweight) - (ItemData.Weight * 5);
    }
    else {
        amount--;

        MainItem.dataset.currectweight = Number(currectweight) - ItemData.Weight
    }
    
    if (amount < 1)
        Item.remove();

    AmountTxtElement.textContent = `כמות - ${amount}`;
}

function AddItemsToArsenal(Category)
{
    for (Item of Items) {
        if (Item.Category === Category)
        {
            let CloneArsItem = ItemArsenalCopy.cloneNode(true)

            CloneArsItem.children[0].children[0].src = `data:image/png;base64,${Item.Image}`;

            CloneArsItem.children[1].children[0].textContent = Item.Title
            CloneArsItem.children[1].children[1].textContent = Item.Description
            CloneArsItem.children[1].children[2].textContent = `משקל: ${Item.Weight}kg`

            CloneArsItem.id = Item.ItemId
            CloneArsItem.style.display = "flex"

            CloneArsItem.addEventListener("dragstart", function(e) {
                let Selected = e.target;
                Selected.classList.add("dragging");
            })
    
            CloneArsItem.addEventListener("dragend", function(e) {
                let Selected = e.target;
                Selected.classList.remove("dragging");
            })

            Arsenal_Right.appendChild(CloneArsItem)
        }
    }
}

function RemoveItemsFromArsenal()
{
    let ArsenalItemsBox = document.getElementById("Arsenal_Right");

    let ItemsInArsenal = ArsenalItemsBox.querySelectorAll(".Item");
    ItemsInArsenal.forEach(Item => {
        if (!Item.classList.contains("Arsenal_Buttons") && Item.id !== "ItemArsenalCopy") {
            Item.remove();
        }
    });
}

function AddingBIEventLisener(MainInvBoxes, MainInvItems, MainItemsType) {
    for (let i = 0; i < MainInvBoxes.length; i++)
    {
        let CurrectBox = document.getElementById(MainInvBoxes[i])
        let CurrectItem = document.getElementById(MainInvItems[i])

        // Box
        CurrectBox.addEventListener("dragenter", function() {
            CurrectBox.style.backgroundColor = "#262f3c";
        });
    
        CurrectBox.addEventListener("dragleave", function() {
            CurrectBox.style.backgroundColor = "#202833";
        });
    
    
        CurrectBox.addEventListener("dragover", function(e) {
            e.preventDefault();
        })
    
        CurrectBox.addEventListener("drop", function(e) {
            e.preventDefault();
    
            CurrectBox.style.backgroundColor = "#202833";
    
            PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"])
        })

        // Item
        CurrectItem.addEventListener("dragover", function(e) {
            e.preventDefault();
        })
    
        CurrectItem.addEventListener("drop", function(e) {
            e.preventDefault();
    
            PlaceNewMainItem(CurrectItem, MainItemsType[i])
        })
    }
}