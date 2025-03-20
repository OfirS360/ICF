let ItemStoredCopy = document.getElementById("ItemStoredClone")
let ItemArsenalCopy = document.getElementById("ItemArsenalCopy")
let Arsenal_Right = document.getElementById("Arsenal_Right")
let UniformBox = document.getElementById("uniformBox")

let UniformItem = document.getElementById("UnifromItem")

let UniformSpace = 0
let UniformWieght = 0

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

        let UpdatedValues = PlaceNewItem(UniformBox, ["Item", "Attachment", "Facewear", "Nvg"], UniformWieght, UniformSpace)
        UniformWieght = UpdatedValues.updatedWeight;
        UniformSpace = UpdatedValues.updatedSpace;
    })

    UniformItem.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    UniformItem.addEventListener("drop", function(e) {
        e.preventDefault();

        let UpdatedValues = PlaceNewMainItem(UniformItem, "Uniform", UniformWieght, UniformSpace)
        UniformWieght = UpdatedValues.updatedWeight;
        UniformSpace = UpdatedValues.updatedSpace;
    })

    // Arsenal
    Arsenal_Right.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    Arsenal_Right.addEventListener("drop", function(e) {
        e.preventDefault();

        let Selected = document.querySelector(".dragging")
        if (!Arsenal_Right.contains(Selected))
            Selected.remove()
    })
}

// Functions
function PlaceNewItem(Box, AllowItems, PlaceWeight, PlaceSpace)
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

                PlaceWeight += Item.Weight
                if (PlaceSpace < PlaceWeight)
                {
                    return
                }

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

                return { updatedWeight: PlaceWeight, updatedSpace: PlaceSpace };
            }
        }
    }
}

function PlaceNewMainItem(Box, AllowItem, PlaceWeight, PlaceSpace)
{
    let Selected = document.querySelector(".dragging");

    for (Item of Items)
        {
            if (Item.ItemId === Selected.id && Item.Type === AllowItem)
            {
                PlaceWeight = 0
                PlaceSpace = Item.Space
                Box.children[0].id = Item.ItemId
                Box.children[0].src = Selected.children[0].children[0].src

                return { updatedWeight: PlaceWeight, updatedSpace: PlaceSpace };
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

