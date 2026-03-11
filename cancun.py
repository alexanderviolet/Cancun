#!/usr/bin/env python3
"""
Cancun Spring Break Packing Checklist
An interactive program to make sure you're ready for your trip!
"""

def print_header():
    """Print a fun header for the program"""
    print("=" * 50)
    print("🏖️  CANCUN SPRING BREAK PACKING CHECKER 🏖️".center(50))
    print("=" * 50)
    print("Answer 'yes' or 'no' to the following questions.\n")

def get_yes_no_input(question):
    """Get and validate yes/no input from user"""
    while True:
        response = input(f"{question} (yes/no): ").strip().lower()
        if response in ['yes', 'y']:
            return True
        elif response in ['no', 'n']:
            return False
        else:
            print("❌ Please answer with 'yes' or 'no'")

def main():
    """Main function to run the packing checklist"""
    print_header()
    
    # Define the packing checklist
    checklist = {
        'passport': "📄 Passport (don't forget it's valid for 6+ months!)",
        'visa_or_tourist_card': "🎫 Visa/Tourist Card (if needed)",
        'flight_confirmation': "✈️ Flight confirmation/boarding pass",
        'hotel_confirmation': "🏨 Hotel reservation confirmation",
        'sunscreen': "🧴 Sunscreen (SPF 50+ - Cancun sun is no joke!)",
        'swimsuit': "👙 Swimsuit (pack at least 2!)",
        'sunglasses': "🕶️ Sunglasses",
        'hat': "🧢 Hat/Baseball cap",
        'beach_towel': "🏖️ Beach towel",
        'flip_flops': "🩴 Flip flops/sandals",
        'toiletries': "🧼 Toiletries (toothbrush, toothpaste, deodorant, etc.)",
        'insect_repellent': "🦟 Insect repellent",
        'phone_charger': "🔌 Phone charger",
        'camera': "📷 Camera/GoPro",
        'cash_and_cards': "💵 Cash (pesos) and credit/debit cards",
        'party_outfits': "👗 Going out outfits (clubs/bars)",
        'hangover_kit': "🤢 Hangover kit (advil, pepto, water)"
    }
    
    # Track missing items
    missing_items = []
    packed_items = []
    
    print("Let's check what you've packed! 📝\n")
    
    # Go through each item in the checklist
    for key, item in checklist.items():
        if get_yes_no_input(f"Have you packed {item}?"):
            packed_items.append(key)
            print("  ✅ Great!\n")
        else:
            missing_items.append(key)
            print("  ❌ Uh oh, add this to your bag!\n")
    
    # Calculate results
    total_items = len(checklist)
    packed_count = len(packed_items)
    missing_count = len(missing_items)
    
    print("\n" + "=" * 50)
    print("📊 PACKING SUMMARY 📊".center(50))
    print("=" * 50)
    print(f"✅ Packed: {packed_count}/{total_items} items")
    print(f"❌ Missing: {missing_count}/{total_items} items")
    
    # Display results with appropriate message
    print("\n" + "=" * 50)
    
    if missing_count == 0:
        print("\n🎉🎉🎉 AMAZING! 🎉🎉🎉".center(50))
        print("You're fully packed and ready for Cancun!".center(50))
        print("Have an incredible spring break! 🌊🍹☀️".center(50))
        print("\nDon't forget to:")
        print("  • Double-check your passport one more time")
        print("  • Download some playlists for the flight")
        print("  • Tell your bank you're traveling")
    else:
        print("\n😱 OH NO, SPRING BREAK DISASTER! 😱".center(50))
        print("YOU'RE NOT READY FOR CANCUN YET!".center(50))
        print("\n🚨 PACK THESE ITEMS NOW OR ELSE! 🚨".center(50))
        print("\nMissing items:")
        for key in missing_items:
            print(f"  • {checklist[key]}")
        
        print("\n⚠️  WARNING: Don't even think about getting on the")
        print("plane without these! You'll regret it in Cancun!")
        print("\nNow stop reading this and go pack! 🏃‍♂️💨")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    try:
        main()
        print("\nThanks for using the Cancun Packing Checker! 🏖️")
    except KeyboardInterrupt:
        print("\n\nExiting... Pack later, I guess? 🤷")
    except Exception as e:
        print(f"\nOops! Something went wrong: {e}")
        print("But seriously, don't forget your passport!")