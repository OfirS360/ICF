let LoadingScreen = document.getElementById("LoadingContent")

let SaveLoadoutBtn = document.getElementById("SaveLoadout")

let DetailBox = document.getElementById("DetailBox")
let DetailTitle = document.getElementById("DetailTitle")
let DetailProgress = document.getElementById("DetailProgress")
let DetailDes = document.getElementById("DetailDes")
let DetailWeight = document.getElementById("DetailWeight")
let DetailSpace = document.getElementById("DetailSpace")

let ItemStoredCopy = document.getElementById("ItemStoredClone")
let ItemArsenalCopy = document.getElementById("ItemArsenalCopy")
let MainItemClone = document.getElementById("MainItemClone")
let WeaponItemClone = document.getElementById("WeaponItemClone")
let AttachmentBoxClone = document.getElementById("AttachmentsBoxClone")
let AttachmentItemClone = document.getElementById("AttachmentItemClone")

let Arsenal_Right = document.getElementById("Arsenal_Right")
let UniformBox = document.getElementById("uniformBox")
let VestBox = document.getElementById("vestBox")
let backpackBox = document.getElementById("backpackBox")

let UniformItem = document.getElementById("UniformItem")
let VestItem = document.getElementById("VestItem")
let BackpackItem = document.getElementById("BackpackItem")

let PrimaryItem = document.getElementById("main_weapon")

let MainInvBoxes = ["uniformBox", "vestBox", "backpackBox"];
let MainInvItems = ["UniformItem", "VestItem", "BackpackItem", "Binocular", "Nvg", "Glasses", "Helmet", "Map", "Gps", "Radio", "Compass", "Watch"]
let MainItemsType = ["Uniform", "Vest", "Backpack", "Binocular", "Nvg", "Facewear", "Helmet", "Map", "Gps", "Radio", "Compass", "Watch"]

let WeaponsItems = ["main_weapon", "launcher", "pistol"];
let WeaponsType = ["Primary", "Secondary", "Handgun"];

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
    LoadingScreen.style.display = "flex"
    await GetAllItems()
    LoadingScreen.style.display = "none"

    Items.sort((a, b) => a.Type.localeCompare(b.Type))

    console.log(Items)

    let Ars_WeaponsBtn = document.getElementById("Ars_Weapons")
    let Ars_AttachmentsBtn = document.getElementById("Ars_Attachments")
    let Ars_MainItemsBtn = document.getElementById("Ars_MainItems")
    let Ars_ClothingBtn = document.getElementById("Ars_Clothing")
    let Ars_ItemsBtn = document.getElementById("Ars_Items")

    SaveLoadoutBtn.onclick = () => {
        SaveLoadout()
    }

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
    AddingWeaponsEventLisener(WeaponsItems)

    // Arsenal
    Arsenal_Right.addEventListener("dragover", function(e) {
        e.preventDefault();
    })

    Arsenal_Right.addEventListener("drop", function(e) {
        e.preventDefault();

        let Selected = document.querySelector(".dragging")

        DetailBox.style.display = "none";

        if (UniformBox.contains(Selected) || VestBox.contains(Selected) || backpackBox.contains(Selected))
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
                    NewItemImg.src = `data:image/png;base64,${Item.Image}`

                    let NewItemTitle = NewItem.children[2].children[0]
                    NewItemTitle.textContent = Item.Title

                    if (Item.AtchType === "magazine") {
                        NewItem.dataset.space = Item.Space
                    }

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
            if (Item.ItemId === Selected.id && Item.Type === AllowItem && Box.childElementCount == 1)
            {
                MainItemC = MainItemClone.cloneNode(false);

                MainItemC.id = Item.ItemId
                MainItemC.src = Selected.children[0].children[0].src

                MainItemC.style.display = "block"

                MainItemC.dataset.currectweight = 0
                MainItemC.dataset.space = Item.Space

                Box.appendChild(MainItemC)

                AddingEventLisener(MainItemC)

                if (Item.Type === "Uniform" || Item.Type === "Vest" || Item.Type === "Backpack")
                    AddHoverLiseners(Item, MainItemC)

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

function AddHoverLiseners(ItemData, Item) {
    Item.addEventListener("mouseenter", function() {
        let ItemPos = Item.getBoundingClientRect();

        DetailBox.style.left = (ItemPos.left + Item.offsetWidth + 10) + "px"
        DetailBox.style.top = ItemPos.top + "px"

        DetailTitle.textContent = ItemData.Title
        DetailDes.textContent = "תיאור: " + ItemData.Description
        DetailWeight.textContent = "משקל: " + ItemData.Weight + "kg"
        DetailSpace.textContent = "מקום: " + ItemData.Space + "kg"
        
        DetailProgress.max = Item.dataset.space
        DetailProgress.value = Item.dataset.currectweight

        DetailBox.style.display = "flex";
    })

    Item.addEventListener("mouseleave", function() {
        DetailBox.style.display = "none";
    });
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
    for (let i = 0; i < MainInvItems.length; i++)
    {
        if (i < 3) {
            let CurrectBox = document.getElementById(MainInvBoxes[i])
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
        
                let Selected = document.querySelector(".dragging");

                if (UniformBox.contains(Selected) && CurrectBox !== UniformBox) {    
                    PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"])
                    DecreseItem(Selected)
                }

                else if (VestBox.contains(Selected) && CurrectBox !== VestBox) {
                    PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"])
                    DecreseItem(Selected)
                }

                else if (backpackBox.contains(Selected) && CurrectBox !== backpackBox) {
                    PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"])
                    DecreseItem(Selected)
                }
                else {
                    PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"])
                }
            })
        }

        let CurrectItem = document.getElementById(MainInvItems[i])

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

function AddingWeaponsEventLisener(WeaponsItems) {
    for (let i = 0; i < WeaponsItems.length; i++)
    {
        let CurrectBox = document.getElementById(WeaponsItems[i])

        CurrectBox.addEventListener("dragover", function(e) {
            e.preventDefault();
        })
    
        CurrectBox.addEventListener("drop", function(e) {
            e.preventDefault();
    
            if (CurrectBox.childElementCount === 1)
                PlaceNewWeaponItem(CurrectBox, WeaponsType[i])
        })
    }
}

function PlaceNewWeaponItem(Box, AllowItem) {
    let Selected = document.querySelector(".dragging");

    for (Item of Items)
    {
        if (Item.ItemId === Selected.id && Item.Type === AllowItem)
        {
            MainItemC = WeaponItemClone.cloneNode(true);

            MainItemC.id = Item.ItemId
            MainItemC.children[0].src = `data:image/png;base64,${Item.Image}`

            if (Item.Type === "Handgun") {
                MainItemC.children[0].style.scale = "1.5"
            }

            let AttachmentBox = AttachmentBoxClone.cloneNode(true);
            AttachmentBox.style.display = "flex"

            AttachmentBox.id = Item.WeaponType

            if(Item.Type === "Secondary") {
                AttachmentBox.children[2].remove()
                AttachmentBox.children[2].remove()
                AttachmentBox.children[2].remove()

                if (Item.WeaponType === "Rocket") {
                    AttachmentBox.children[1].remove()
                }
            }

            if (Item.Type === "Handgun") {
                AttachmentBox.children[3].remove()

                if (Item.WeaponType === "Matol") {
                    AttachmentBox.children[1].remove()
                    AttachmentBox.children[1].remove()
                    AttachmentBox.children[1].remove()
                }
            }

            MainItemC.appendChild(AttachmentBox)

            AddingAttachmentsLisener(AttachmentBox, Item)

            MainItemC.style.display = "flex"

            Box.appendChild(MainItemC)

            AddingEventLisener(MainItemC)

            break
        }
     }
}

function AddingAttachmentsLisener(AttachmentBox, WeaponItem) {
    for (let i = 0; i < AttachmentBox.childElementCount; i++) {
        AttachmentBox.children[i].addEventListener("dragover", function(e) {
            e.preventDefault();
        })

        AttachmentBox.children[i].addEventListener("drop", function(e) {
            e.preventDefault();

            let Selected = document.querySelector(".dragging");

            let ItemData;

            for (Item of Items) {
                if (Item.ItemId === Selected.id) {
                    ItemData = Item
                    break
                }
            }
            
            if (ItemData.Type === "Attachment" && ItemData.AtchType === AttachmentBox.children[i].dataset.type && AttachmentBox.children[i].childElementCount < 2 && ItemData.WeaponType === AttachmentBox.id) {
                if (ItemData.AtchType === "magazine" && ItemData.Caliber !== Item.Caliber)
                    return
                
                AttachmentItem = AttachmentItemClone.cloneNode(true)
                AttachmentItem.src = `data:image/png;base64,${Item.Image}`
                AttachmentItem.id = ItemData.ItemId

                AddButtonAtchLisener(AttachmentItem)

                AttachmentBox.children[i].appendChild(AttachmentItem)
            }
        })
    }
}

function AddButtonAtchLisener(Item) {
    Item.addEventListener("click", function(e) {
        if (IsShiftDown) {
            Item.remove()
        }
    })
}

function SaveLoadout() {    
    let LoadoutSkeleton = [
        ["Primary", "Muzzel", "Side", "Top", ["Mag", 31],
          ["MatolRound", 1], ""
        ],

        ["Rocket", "", "", "Top", ["Mag", 1],
          [], ""
        ],

        ["Handgun", "Muzzel", "Side", "Top", ["Mag", 15],
          [], ""
        ],

        ["Uniform", []],

        ["Vest", []],

        ["Backpack", []],

        "Helmet", "Facewear", ["Binocul", "", "", "", ["Laserbatteries", 1],
          [], ""
        ],

        ["ItemMap", "ItemGPS", "", "ItemCompass", "ItemWatch", ""]
    ]

    for (let i = 0; i < MainInvItems.length; i++) {
        let CurrectWeapon = document.getElementById(WeaponsItems[i]);
        if (!CurrectWeapon) continue;
        
        let WeaponItem = CurrectWeapon.children[1];
        if (!WeaponItem) continue;
        
        let AttachmentBox = WeaponItem.children[1];
        if (!AttachmentBox) continue;
    
        LoadoutSkeleton[i][0] = WeaponItem.id || "";
        
        LoadoutSkeleton[i][1] = AttachmentBox.children[4]?.children[1]?.id || "";
        LoadoutSkeleton[i][2] = AttachmentBox.children[2]?.children[1]?.id || "";
        LoadoutSkeleton[i][3] = AttachmentBox.children[1]?.children[1]?.id || "";
        LoadoutSkeleton[i][4] = [
            AttachmentBox.children[0]?.children[1]?.id || "",
            31
        ];
        LoadoutSkeleton[i][5] = AttachmentBox.children[3]?.children[1]?.id || "";
    }

    for (let i = 0; i < 3; i++) {
        let CurrectMainItem = document.getElementById(MainInvItems[i])
        let CurrectMainBox = document.getElementById(MainInvBoxes[i])

        LoadoutSkeleton[3 + i][0] = CurrectMainItem.children[1]?.id || "";

        for (let j = 0; j < CurrectMainBox.childElementCount; j++) {
            let AmountTxtElement = CurrectMainBox.children[j].children[2].children[1];
            let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);

            let ItemToPush = [CurrectMainBox.children[j].id, amount]

            if (CurrectMainBox.children[j].dataset.space) {
                ItemToPush.push(Number(CurrectMainBox.children[j].dataset.space))
            }

            LoadoutSkeleton[3 + i][1].push(ItemToPush)
        }
    }

    let Helmet = document.getElementById("Helmet")
    HelmetId = Helmet.children[1]?.id
    LoadoutSkeleton[6] = HelmetId

    let Facewear = document.getElementById("Glasses")
    FacewearId = Facewear.children[1]?.id
    LoadoutSkeleton[7] = FacewearId

    let Binocular = document.getElementById("Binocular")
    BinocularId = Binocular.children[1]?.id
    LoadoutSkeleton[8][0] = BinocularId

    let LoadoutForm = {
        SteamId: UserData2.SteamId,
        Loadout: JSON.stringify(LoadoutSkeleton)
    }

    console.log(LoadoutForm)
    
    fetch("https://icf-api-ten.vercel.app/SaveLoadout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(LoadoutForm)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        console.log("Form submitted successfully!");
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}