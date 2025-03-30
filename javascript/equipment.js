let LoadingScreen = document.getElementById("LoadingContent")

let SaveLoadoutBtn = document.getElementById("SaveLoadout")
let ImportLoadoutBtn = document.getElementById("ImportLoadout")

let Items

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

let AtchTypes = ["", "muzzle", "side", "top", "magazine", "bipod"]

let IsShiftDown = false

initializePage()

// אתחול הדף
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
    await GetPlayerLoadout()
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

    ImportLoadoutBtn.onclick = async () => {
        try {
            let ImportedLoadout = await navigator.clipboard.readText();
            ImportedLoadout = JSON.parse(ImportedLoadout);
            
            ImportedLoadout = ImportedLoadout[0]
            console.log(ImportedLoadout)

            ClearLoadout()
            LoadLoadout(ImportedLoadout)
            PopAlert("הפקל נטען!", 1, "עכשיו תוכל לערוך לפי רצונך, רק אל תשכח לשמור.")
        } catch (error) {
            console.error("Unvalid Import");
            console.error(error)
        }
    }

    Ars_WeaponsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_WeaponsBtn.value), Items)
    }

    Ars_AttachmentsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_AttachmentsBtn.value), Items)
    }

    Ars_MainItemsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_MainItemsBtn.value), Items)
    }

    Ars_ClothingBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_ClothingBtn.value), Items)
    }

    Ars_ItemsBtn.onclick = () => {
        RemoveItemsFromArsenal()
        AddItemsToArsenal(Number(Ars_ItemsBtn.value), Items)
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

// פונקציות

// הוספת חפצים
/**
 * הפונקציה שמה את החפץ בתיק שהמשתמש גרר אותו
 * @param {*} Box התיק שאליו צריך לשייך את החפץ
 * @param {*} AllowItems מערך של סוגי חפצים שניתן להכניס אותם לתיק
 */
function PlaceNewItem(Box, AllowItems, Selected = null, IsLoading = false, Amount)      
{
    if (!Selected) {
        Selected = document.querySelector(".dragging");
    }

    if (!IsLoading && Box.contains(Selected))
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

                if (!MainItem) {
                    if (!IsLoading)
                        PopAlert("חסר תיק", 0, "כדי לשים חפצים בתוך מקום זה, עליך לשים תיק מתאים")

                    return
                }
                    

                if (Number(MainItem.dataset.currectweight) + Item.Weight > Number(MainItem.dataset.space))
                {
                    PopAlert("אין מקום", 0, "הגעת לניצול המקסימלי של התיק")
                    return
                }

                MainItem.dataset.currectweight = Number(MainItem.dataset.currectweight) + Item.Weight

                if (!CheckIfExists) {

                    let NewItem = ItemStoredCopy.cloneNode(true);
                    NewItem.id = Selected.id

                    let NewItemImg = NewItem.children[1].children[0]
                    NewItemImg.src = `${Item.Image}`

                    let NewItemTitle = NewItem.children[2].children[0]
                    NewItemTitle.textContent = Item.Title

                    if (Item.AtchType === "magazine") {
                        NewItem.dataset.space = Item.Space
                    }

                    NewItem.style.display = "flex"
                    Box.appendChild(NewItem)

                    if (!IsLoading)
                        Selected.classList.remove("dragging");
                    else {
                        NewItem.children[2].children[1].textContent = `כמות - ${Amount}`
                    }

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

/**
 * הפונקציה שמה חפץ ראשי בתוך המקום המתאים לו
 * @param {*} Box המקום בו המשתמש גרר את החפץ
 * @param {*} AllowItem החפץ שמותר להכניס
 */
function PlaceNewMainItem(Box, AllowItem, Selected = null)
{
    if (!Selected) {
        Selected = document.querySelector(".dragging");
    }

    for (Item of Items)
        {
            if (Item.ItemId === Selected.id && Item.Type === AllowItem && Box.childElementCount == 1)
            {
                MainItemC = MainItemClone.cloneNode(false);

                MainItemC.id = Item.ItemId
                MainItemC.src = `${Item.Image}`

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

/**
 * מוסיפה  את הנשק המאים ברגע שהוא נגרר, ומוסיפה גם אופציה לתוספים
 * @param {*} Box הסלוט שאליו החפץ נכנס
 * @param {*} AllowItem סוג נשק מתאים שאפשר להכניס אותו לסלוט
 */
function PlaceNewWeaponItem(Box, AllowItem, Selected = null) {

    if (!Selected) {
        Selected = document.querySelector(".dragging");
    }

    for (Item of Items)
    {
        if (Item.ItemId === Selected.id && Item.Type === AllowItem)
        {
            MainItemC = WeaponItemClone.cloneNode(true);

            MainItemC.id = Item.ItemId
            MainItemC.children[0].src = `${Item.Image}`

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

function PlaceAttachment(Box, WeaponType, Selected = null) {

    if (!Selected)
        Selected = document.querySelector(".dragging");

    let ItemData;

    for (Item of Items) {
        if (Item.ItemId === Selected.id) {
            ItemData = Item
            break
        }
    }

    if (ItemData && ItemData.Type === "Attachment" && ItemData.AtchType === Box.dataset.type && Box.childElementCount < 2 && ItemData.WeaponType === WeaponType) {
        if (ItemData.AtchType === "magazine" && ItemData.Caliber !== Item.Caliber)
            return
                
        AttachmentItem = AttachmentItemClone.cloneNode(true)
        AttachmentItem.src = `${Item.Image}`
        AttachmentItem.id = ItemData.ItemId

        AddButtonAtchLisener(AttachmentItem)

        Box.appendChild(AttachmentItem)
    }
}

// הוספת האזנות
/**
 * מוספיה לחפץ האזנות של גרירה
 * @param {*} Item החפץ שאליו מוסיפים את הגרירה
 */
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

/**
 * לחפץ הנמצא בתיק, מוסיפים לו האזנות של כפתורי פלוס ומינוס כדי להגדיל את הכמות
 * @param {*} Item החפץ שאליו צריך להוסיף את האזנות
 */
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

/**
 * הפונקציה מציגה מידע על תיקים שונים
 * @param {*} ItemData חפץ המקור מהנתונים
 * @param {*} Item האלמנט של החפץ
 */
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

/**
 * מוסיפה האזנות ופעולות לכל הסלוטים של החפצים, אם החפץ הוא תיק כלשהו אז זה יאפשר גם לשים דברים בתוכו
 * @param {*} MainInvBoxes מערך של האלמנטים של התיקים
 * @param {*} MainInvItems מערך של האלמנטים של החפצים
 * @param {*} MainItemsType מערך של סוגי החפצים שרשאים לאותו חפץ
 */
function AddingBIEventLisener(MainInvBoxes, MainInvItems, MainItemsType) {
    for (let i = 0; i < MainInvItems.length; i++)
    {
        if (i < 3) {
            let CurrectBox = document.getElementById(MainInvBoxes[i])
            // Box

            // Animation
            CurrectBox.addEventListener("dragenter", function() {
                CurrectBox.style.backgroundColor = "#262f3c";
            });
        
            CurrectBox.addEventListener("dragleave", function() {
                CurrectBox.style.backgroundColor = "#202833";
            });

            // Main
            CurrectBox.addEventListener("dragover", function(e) {
                e.preventDefault();
            })
        
            CurrectBox.addEventListener("drop", function(e) {
                e.preventDefault();
        
                CurrectBox.style.backgroundColor = "#202833";
        
                let Selected = document.querySelector(".dragging");

                // אם הועבר מתיק אחר
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

/**
 * מוסיפה האזנות לסלוטים של הנשקים
 * @param {*} WeaponsItems מערך של האלמנטים של הנשקים
 */
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

/**
 * מוסיפה האזנות לאלמנט התוספים, ומוסיפה פעולה ברגע שנגרר תוסף לסלוט מתאים
 * @param {*} AttachmentBox האלמנט של התוספים
 */
function AddingAttachmentsLisener(AttachmentBox) {
    for (let i = 0; i < AttachmentBox.childElementCount; i++) {
        AttachmentBox.children[i].addEventListener("dragover", function(e) {
            e.preventDefault();
        })

        AttachmentBox.children[i].addEventListener("drop", function(e) {
            e.preventDefault();

            PlaceAttachment(AttachmentBox.children[i], AttachmentBox.id)
        })
    }
}

/**
 * מוסיפה האזנה לחפץ תוסף, שאם שיפט לחוץ והחפץ נלחץ אז זה מוחק אותו
 * @param {*} Item החפץ מסוג תוסף
 */
function AddButtonAtchLisener(Item) {
    Item.addEventListener("click", function(e) {
        if (IsShiftDown) {
            Item.remove()
        }
    })
}


// פעולות הוספה והחסרה של חפצים בתיק
/**
 * הפונקציה מוסיפה כמות לחפץ, במידה ושיפט נלחץ, מוסיפה 5
 * @param {*} Item החפץ שאליו הכמות נוספת
 */
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
        if (Number(currectweight) + (ItemData.Weight * 5) > Number(space)) {
            PopAlert("אין מקום", 0, "הגעת לניצול המקסימלי של התיק")
            return
        }
            

        amount+= 5;
        MainItem.dataset.currectweight = Number(currectweight) + (ItemData.Weight * 5)
    }
    else {
        if (Number(currectweight) + ItemData.Weight > Number(space)) { 
            PopAlert("אין מקום", 0, "הגעת לניצול המקסימלי של התיק")
            return
        }
            

        amount++;
        MainItem.dataset.currectweight = Number(currectweight) + ItemData.Weight
    }
    
    
    AmountTxtElement.textContent = `כמות - ${amount}`;
}

/**
 * הפונקציה מחסירה כמות לחפץ, במידה ושיפט נלחץ, מחסירה 5
 * @param {*} Item החפץ שאליו הכמות נוספת
 */
function DecreseItem(Item)
{
    let AmountTxtElement = Item.children[2].children[1];
    let amount = parseInt(AmountTxtElement.textContent.split(" - ")[1]);

    let MainItem = Item.parentElement.parentElement.children[0].children[1]
    let currectweight = MainItem.dataset.currectweight

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

// פעולות בארסנל
/**
 * לאחר שהמשתמש בחר קטגוריה, הפונקציה מציגה את כל החפצים שבתוך הקטגוריה |
 * צריך להוסיף: גישות, דרגות, פקלים, הכשרות
 * @param {*} Category הקטגוריה שנבחרה
 */
function AddItemsToArsenal(Category, Items)
{
    for (Item of Items) {
        if (Item.Category === Category)
        {
            let CloneArsItem = ItemArsenalCopy.cloneNode(true)

            CloneArsItem.children[0].children[0].src = `${Item.Image}`;

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

/**
 * מוחקת את כל החפצים שנמצאים בארסנל
 */
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

// נתונים
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
        PopAlert("הפקל נשמר בהצלחה!", 1, "עכשיו תוכל להתחבר לשרת עם הפקל ששמרת.")
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}

function LoadLoadout(LoadoutSkeleton) {

    // נשקים
    for (let i = 0; i < 3; i++) {
        let CurrectBox = document.getElementById(WeaponsItems[i])
        let AllowItem = WeaponsType[i]

        let Selected = {
            id: LoadoutSkeleton[i][0]
        }

        PlaceNewWeaponItem(CurrectBox, AllowItem, Selected)

        let AttachmentBox = document.querySelector(`#${LoadoutSkeleton[i][0]} .Attachments_Box`)
        if (!AttachmentBox)
            continue

        for (let j = 0; j < AttachmentBox.childElementCount; j++) { 

            for(let z = 1; z < AtchTypes.length; z++) {

                if (AtchTypes[z] === AttachmentBox.children[j].dataset.type) {
                    if (z == 4) {
                        Selected = {
                            id: LoadoutSkeleton[i][z][0]
                        }
                    }
                    else {
                        Selected = {
                            id: LoadoutSkeleton[i][z]
                        }
                    }
                    
                    PlaceAttachment(AttachmentBox.children[j], AttachmentBox.id, Selected)
                    break
                }
            }
        }
    }

    // תיקים
    for (let i = 0; i < 3; i++) {
        let CurrectItem = document.getElementById(MainInvItems[i])
        let AllowItem = MainItemsType[i]

        let Selected = {
            id: LoadoutSkeleton[3 + i][0]
        }

        PlaceNewMainItem(CurrectItem, AllowItem, Selected)

        let CurrectBox = document.getElementById(MainInvBoxes[i])
        for (let j = 0; j < LoadoutSkeleton[3 + i][1].length; j++) {
            Selected = {
                id: LoadoutSkeleton[3 + i][1][j][0]
            }

            PlaceNewItem(CurrectBox, ["Item", "Attachment", "Facewear", "Nvg"], Selected, true, LoadoutSkeleton[3 + i][1][j][1])
        }
    }

    // קסדה
    let CurrectItem = document.getElementById(MainInvItems[6])

    let Selected = {
        id: LoadoutSkeleton[6]
    }

    PlaceNewMainItem(CurrectItem, MainItemsType[6], Selected)

    // לבוש פנים
    CurrectItem = document.getElementById(MainInvItems[5])

    Selected = {
        id: LoadoutSkeleton[7]
    }

    PlaceNewMainItem(CurrectItem, MainItemsType[5], Selected)

    // משקפת
    CurrectItem = document.getElementById(MainInvItems[3])

    Selected = {
        id: LoadoutSkeleton[8][0]
    }

    PlaceNewMainItem(CurrectItem, MainItemsType[3], Selected)
}

function ClearLoadout() {
    ItemsToDelete = document.querySelectorAll(".MainItemImg, .ItemStored, .WeaponItem, .Attachments_Box, .AttachmentItem")

    ItemsToDelete.forEach(Item => {
        if (Item.id !== "MainItemClone" && Item.id !== "ItemStoredClone" && Item.id !== "WeaponItemClone" && Item.id !== "AttachmentsBoxClone" && Item.id !== "AttachmentItemClone") {
            Item.remove()
        }
    })
}

/**
 * @returns מחזירה את כל החפצים שנמצאים בנתונים
 */
async function GetAllItems() {
    try {
        const response = await fetch(`https://icf-api-ten.vercel.app/GetAllItems`);

        let data = await response.json();

        if (data.results) {
            sessionStorage.setItem("Items", JSON.stringify(data.results))
            Items = data.results
        }
    }
    catch (error) {
        return
    }
}

/**
 * מקבל את הפקל של המשתמש וטוען אותה באתר
 */
async function GetPlayerLoadout() {
    const response = await fetch(`https://icf-api-ten.vercel.app/GetLoadout/${UserData2.SteamId}`);
    let data = await response.text();

    console.log(data)

    if (data) {
        data = JSON.parse(data)
        console.log(data)
        LoadLoadout(data)
    }
}