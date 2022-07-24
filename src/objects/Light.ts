type LightConstructorType = {
  position: number[];
  Ila: number[];
  Il: number[];
};

export class Light {
  public position: number[];
  public Ila: number[];
  public Il: number[];

  constructor({ position, Ila, Il }: LightConstructorType) {
    this.position = [...position];
    this.Ila = [...Ila];
    this.Il = [...Il];
  }

  setPosition(position: number[]) {
    this.position = [...position];
  }

  setAmbientLightIntensity(Ila: number[]) {
    this.Ila = [...Ila];
  }

  setLightIntensity(Il: number[]) {
    this.Il = [...Il];
  }
}
