import {CheckboxGroup, Checkbox} from "@nextui-org/react";

export default function Features() {
  return (

    <>

        <h1>Features</h1>
        <CheckboxGroup
        label="Select Features"
        defaultValue={["buenos-aires", "london"]}
        >
                <Checkbox value="Air Conditioner">Air Conditioner</Checkbox>
                <Checkbox value="Digital Odometer">Digital Odometer</Checkbox>
                <Checkbox value="Heater">Heater</Checkbox>
                <Checkbox value="Leather Seats">Leather Seats</Checkbox>
                <Checkbox value="Panoramic Sunroof">Panoramic Sunroof</Checkbox>
                <Checkbox value="Tachometer">Tachometer</Checkbox>
                <Checkbox value="Touchscreen Display">Touchscreen Display</Checkbox>
                <Checkbox value="Anti-lock Braking">Anti-lock Braking</Checkbox>
                <Checkbox value="Brake Assist">Brake Assist</Checkbox>
                <Checkbox value="Child Safety Locks">Child Safety Locks</Checkbox>
                <Checkbox value="Driver Air Bag">Driver Air Bag</Checkbox>
                <Checkbox value="Power Door Locks">Power Door Locks</Checkbox>
                <Checkbox value="Stability Control">Stability Control</Checkbox>
                <Checkbox value="Traction Control">Traction Control</Checkbox>
                <Checkbox value="Fog Lights Front">Fog Lights Front</Checkbox>
                <Checkbox value="Rain Sensing Wiper">Rain Sensing Wiper</Checkbox>
                <Checkbox value="Rear Spoiler">Rear Spoiler</Checkbox>
                <Checkbox value="Windows - Electric">Windows - Electric</Checkbox>
                <Checkbox value="Comfort & Convenience">Comfort & Convenience</Checkbox>
                <Checkbox value="Android Auto">Android Auto</Checkbox>
                <Checkbox value="Apple CarPlay">Apple CarPlay</Checkbox>
                <Checkbox value="Bluetooth">Bluetooth</Checkbox>
                <Checkbox value="HomeLink">HomeLink</Checkbox>
                <Checkbox value="Power Steering">Power Steering</Checkbox>
                <Checkbox value="Vanity Mirror">Vanity Mirror</Checkbox>

        </CheckboxGroup>

        
    
    </>

  );
}