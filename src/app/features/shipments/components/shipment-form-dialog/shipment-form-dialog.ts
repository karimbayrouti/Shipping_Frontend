/* eslint-disable max-lines, complexity */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShipmentsViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import {
  ShipmentCurrency,
  ShipmentCustomerOption,
  ShipmentCustomerType,
  ShipmentDirection,
  ShipmentDraft,
  ShipmentGoodsCategory,
  ShipmentPackageType,
  ShipmentTransportMode,
  ShipmentWarehouse,
} from '../../models/shipment.model';

interface PackageLineTotals {
  readonly pieces: number;
  readonly packages: number;
  readonly net: number;
  readonly gross: number;
}

@Component({
  selector: 'app-shipment-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Dialog],
  templateUrl: './shipment-form-dialog.html',
  styleUrl: './shipment-form-dialog.scss',
})
export class ShipmentFormDialog implements AfterViewInit, OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly customers = input.required<readonly ShipmentCustomerOption[]>();
  readonly text = input.required<ShipmentsViewTranslations>();
  readonly nextShipmentNumber = input.required<string>();
  readonly nextReceiptNumber = input.required<string>();
  readonly mode = input<'create' | 'edit'>('create');
  readonly initialData = input<ShipmentDraft | null>(null);
  readonly closed = output<void>();
  readonly saved = output<ShipmentDraft>();
  readonly customerCreated = output<ShipmentCustomerOption>();

  protected readonly currencies: readonly ShipmentCurrency[] = [
    'EGP',
    'USD',
    'KWD',
    'SAR',
    'QAR',
    'AED',
  ];
  protected readonly transportModes: readonly ShipmentTransportMode[] = [
    'land',
    'sea',
    'air',
    'multimodal',
  ];
  protected readonly directions: readonly ShipmentDirection[] = ['outbound', 'inbound', 'return'];
  protected readonly packageTypes: readonly ShipmentPackageType[] = [
    'carton',
    'sack',
    'bag',
    'pallet',
    'woodenBox',
    'plasticBox',
    'roll',
    'other',
  ];
  protected readonly goodsCategories: readonly ShipmentGoodsCategory[] = [
    'clothing',
    'shoes',
    'books',
    'foodstuff',
    'furniture',
    'electronics',
    'industrialEquipment',
    'medicalEquipment',
    'buildingMaterials',
    'other',
  ];
  protected readonly warehouses: readonly ShipmentWarehouse[] = [
    'cairo',
    'alexandria',
    'kuwait',
    'doha',
  ];
  protected readonly customerTypes: readonly ShipmentCustomerType[] = ['individual', 'company'];

  private readonly avatarPalette: readonly string[] = [
    '#7c2d3a',
    '#1f2a44',
    '#3f3f46',
    '#4b5563',
    '#5b3a29',
  ];

  protected readonly customerQuery = signal('');
  protected readonly customerResultsVisible = signal(false);
  protected readonly selectedCustomerId = signal<number | null>(null);
  protected readonly customerMissing = signal(false);
  protected readonly quickAddOpen = signal(false);
  protected readonly manualCustomer = signal<ShipmentCustomerOption | null>(null);
  protected readonly senderDiffersFromCustomer = signal(false);

  protected readonly customerResults = computed(() => {
    const query = this.customerQuery().trim().toLocaleLowerCase();
    const list = this.customers();
    const filtered = !query
      ? list
      : list.filter((customer) =>
          [customer.name, customer.phone, customer.email, this.customerCode(customer.id)].some(
            (value) => value.toLocaleLowerCase().includes(query),
          ),
        );
    return filtered.slice(0, 8);
  });

  protected readonly selectedCustomer = computed(() => {
    const id = this.selectedCustomerId();
    if (id === null) return null;
    const fromList = this.customers().find((customer) => customer.id === id);
    if (fromList) return fromList;
    const manual = this.manualCustomer();
    return manual && manual.id === id ? manual : null;
  });

  protected readonly quickAddForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    customerType: 'individual' as ShipmentCustomerType,
    email: [''],
    address: [''],
    city: [''],
    country: ['مصر'],
  });

  protected readonly packageLines = this.formBuilder.array([this.createPackageLine()]);

  protected readonly form = this.formBuilder.nonNullable.group({
    currency: 'EGP' as ShipmentCurrency,
    senderName: [''],
    senderPhone: [''],
    senderAddress: [''],
    receiverName: [''],
    receiverPhone: [''],
    receiverAddress: [''],
    originCity: ['القاهرة'],
    transportMode: 'sea' as ShipmentTransportMode,
    destinationCountry: [''],
    destinationCity: [''],
    direction: 'outbound' as ShipmentDirection,
    packageType: 'carton' as ShipmentPackageType,
    goodsCategory: 'clothing' as ShipmentGoodsCategory,
    price: [null as number | null],
    finalValue: [null as number | null],
    warehouse: 'cairo' as ShipmentWarehouse,
    warehouseKeeper: ['سلمى عبد الله'],
    warehouseNotes: [''],
  });

  ngOnInit(): void {
    const draft = this.initialData();
    if (this.mode() !== 'edit' || !draft) return;

    if (draft.customerId !== null) this.selectedCustomerId.set(draft.customerId);
    this.senderDiffersFromCustomer.set(draft.senderDiffersFromCustomer);

    this.packageLines.clear();
    const lines = draft.packageLines.length > 0 ? draft.packageLines : [];
    lines.forEach(() => this.packageLines.push(this.createPackageLine()));
    if (lines.length === 0) this.packageLines.push(this.createPackageLine());
    else this.packageLines.patchValue([...lines]);

    this.form.patchValue({
      currency: draft.currency,
      senderName: draft.senderName,
      senderPhone: draft.senderPhone,
      senderAddress: draft.senderAddress,
      receiverName: draft.receiverName,
      receiverPhone: draft.receiverPhone,
      receiverAddress: draft.receiverAddress,
      originCity: draft.originCity,
      transportMode: draft.transportMode,
      destinationCountry: draft.destinationCountry,
      destinationCity: draft.destinationCity,
      direction: draft.direction,
      packageType: draft.packageType,
      goodsCategory: draft.goodsCategory,
      price: draft.price,
      finalValue: draft.finalValue,
      warehouse: draft.warehouse,
      warehouseKeeper: draft.warehouseKeeper,
      warehouseNotes: draft.warehouseNotes,
    });
  }

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected currencyLabel(currency: ShipmentCurrency): string {
    const t = this.text();
    const map: Record<ShipmentCurrency, string> = {
      EGP: t.currencyEGP,
      USD: t.currencyUSD,
      KWD: t.currencyKWD,
      SAR: t.currencySAR,
      QAR: t.currencyQAR,
      AED: t.currencyAED,
    };
    return map[currency];
  }

  protected transportModeLabel(mode: ShipmentTransportMode): string {
    const t = this.text();
    const map: Record<ShipmentTransportMode, string> = {
      land: t.transportLand,
      sea: t.transportSea,
      air: t.transportAir,
      multimodal: t.transportMultimodal,
    };
    return map[mode];
  }

  protected directionLabel(direction: ShipmentDirection): string {
    const t = this.text();
    const map: Record<ShipmentDirection, string> = {
      outbound: t.directionOutbound,
      inbound: t.directionInbound,
      return: t.directionReturn,
    };
    return map[direction];
  }

  protected packageTypeLabel(type: ShipmentPackageType): string {
    const t = this.text();
    const map: Record<ShipmentPackageType, string> = {
      carton: t.packageTypeCarton,
      sack: t.packageTypeSack,
      bag: t.packageTypeBag,
      pallet: t.packageTypePallet,
      woodenBox: t.packageTypeWoodenBox,
      plasticBox: t.packageTypePlasticBox,
      roll: t.packageTypeRoll,
      other: t.packageTypeOther,
    };
    return map[type];
  }

  protected goodsCategoryLabel(category: ShipmentGoodsCategory): string {
    const t = this.text();
    const map: Record<ShipmentGoodsCategory, string> = {
      clothing: t.goodsCategoryClothing,
      shoes: t.goodsCategoryShoes,
      books: t.goodsCategoryBooks,
      foodstuff: t.goodsCategoryFoodstuff,
      furniture: t.goodsCategoryFurniture,
      electronics: t.goodsCategoryElectronics,
      industrialEquipment: t.goodsCategoryIndustrialEquipment,
      medicalEquipment: t.goodsCategoryMedicalEquipment,
      buildingMaterials: t.goodsCategoryBuildingMaterials,
      other: t.goodsCategoryOther,
    };
    return map[category];
  }

  protected warehouseLabel(warehouse: ShipmentWarehouse): string {
    const t = this.text();
    const map: Record<ShipmentWarehouse, string> = {
      cairo: t.warehouseCairo,
      alexandria: t.warehouseAlexandria,
      kuwait: t.warehouseKuwait,
      doha: t.warehouseDoha,
    };
    return map[warehouse];
  }

  protected onCustomerSearchInput(event: Event): void {
    this.customerQuery.set((event.target as HTMLInputElement).value);
    this.customerResultsVisible.set(true);
  }

  protected openCustomerResults(): void {
    this.customerResultsVisible.set(true);
  }

  protected closeCustomerResults(): void {
    this.customerResultsVisible.set(false);
  }

  protected selectCustomer(customer: ShipmentCustomerOption): void {
    this.selectedCustomerId.set(customer.id);
    this.customerMissing.set(false);
    this.customerQuery.set('');
    this.customerResultsVisible.set(false);
    this.senderDiffersFromCustomer.set(false);
    this.form.patchValue({ senderName: '', senderPhone: '', senderAddress: '' });
  }

  protected clearCustomer(): void {
    this.selectedCustomerId.set(null);
    this.manualCustomer.set(null);
    this.customerQuery.set('');
    this.senderDiffersFromCustomer.set(false);
    this.form.patchValue({ senderName: '', senderPhone: '', senderAddress: '' });
  }

  protected onSenderDiffersToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.senderDiffersFromCustomer.set(checked);
    if (!checked) {
      this.form.patchValue({ senderName: '', senderPhone: '', senderAddress: '' });
      return;
    }
    const customer = this.selectedCustomer();
    if (!customer) return;
    this.form.patchValue({
      senderName: customer.name,
      senderPhone: customer.phone,
      senderAddress: customer.city,
    });
  }

  protected customerCode(id: number): string {
    return `CUST-${String(id).padStart(4, '0')}`;
  }

  protected initials(name: string): string {
    return name.trim().charAt(0);
  }

  protected avatarColor(id: number): string {
    return this.avatarPalette[id % this.avatarPalette.length] ?? '#54565c';
  }

  protected formatBalance(value: number): string {
    return value.toLocaleString('en-US');
  }

  protected customerTypeLabel(type: ShipmentCustomerType): string {
    const t = this.text();
    const map: Record<ShipmentCustomerType, string> = {
      individual: t.customerTypeIndividual,
      company: t.customerTypeCompany,
    };
    return map[type];
  }

  protected openQuickAdd(): void {
    this.quickAddForm.reset({
      name: this.customerQuery().trim(),
      phone: '',
      customerType: 'individual',
      email: '',
      address: '',
      city: '',
      country: 'مصر',
    });
    this.quickAddOpen.set(true);
  }

  protected closeQuickAdd(): void {
    this.quickAddOpen.set(false);
  }

  protected submitQuickAdd(): void {
    this.quickAddForm.markAllAsTouched();
    if (this.quickAddForm.invalid) return;

    const raw = this.quickAddForm.getRawValue();
    const existingIds = [
      ...this.customers().map((customer) => customer.id),
      this.manualCustomer()?.id ?? 0,
    ];
    const newCustomer: ShipmentCustomerOption = {
      id: Math.max(0, ...existingIds) + 1,
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      city: raw.city,
      balance: 0,
      customerType: raw.customerType,
    };

    this.manualCustomer.set(newCustomer);
    this.selectedCustomerId.set(newCustomer.id);
    this.customerMissing.set(false);
    this.customerQuery.set('');
    this.customerResultsVisible.set(false);
    this.customerCreated.emit(newCustomer);
    this.closeQuickAdd();
  }

  protected lineVolume(line: FormGroup): string {
    const raw = line.getRawValue() as {
      lengthCm: number | null;
      widthCm: number | null;
      heightCm: number | null;
    };
    const { lengthCm, widthCm, heightCm } = raw;
    if (!lengthCm || !widthCm || !heightCm) return '—';
    return ((lengthCm * widthCm * heightCm) / 1_000_000).toFixed(3);
  }

  protected lineTotals(): PackageLineTotals {
    return this.packageLines.controls.reduce<PackageLineTotals>(
      (totals, line) => {
        const raw = line.getRawValue() as {
          pieceCount: number | null;
          packageCount: number | null;
          netWeightKg: number | null;
          grossWeightKg: number | null;
        };
        return {
          pieces: totals.pieces + (raw.pieceCount ?? 0),
          packages: totals.packages + (raw.packageCount ?? 0),
          net: totals.net + (raw.netWeightKg ?? 0),
          gross: totals.gross + (raw.grossWeightKg ?? 0),
        };
      },
      { pieces: 0, packages: 0, net: 0, gross: 0 },
    );
  }

  protected canRemovePackageLine(): boolean {
    return this.packageLines.length > 1;
  }

  protected addPackageLine(): void {
    this.packageLines.push(this.createPackageLine());
  }

  protected removePackageLine(index: number): void {
    if (!this.canRemovePackageLine()) return;
    this.packageLines.removeAt(index);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    const customerId = this.selectedCustomerId();
    if (customerId === null) this.customerMissing.set(true);
    if (this.form.invalid || customerId === null) return;

    const raw = this.form.getRawValue();
    const customer = this.selectedCustomer();
    const differs = this.senderDiffersFromCustomer();
    this.saved.emit({
      customerId,
      currency: raw.currency,
      senderDiffersFromCustomer: differs,
      senderName: differs ? raw.senderName : (customer?.name ?? ''),
      senderPhone: differs ? raw.senderPhone : (customer?.phone ?? ''),
      senderAddress: differs ? raw.senderAddress : (customer?.city ?? ''),
      receiverName: raw.receiverName,
      receiverPhone: raw.receiverPhone,
      receiverAddress: raw.receiverAddress,
      originCity: raw.originCity,
      transportMode: raw.transportMode,
      destinationCountry: raw.destinationCountry,
      destinationCity: raw.destinationCity,
      direction: raw.direction,
      packageType: raw.packageType,
      goodsCategory: raw.goodsCategory,
      packageLines: this.packageLines.getRawValue(),
      price: raw.price,
      finalValue: raw.finalValue,
      warehouse: raw.warehouse,
      warehouseKeeper: raw.warehouseKeeper,
      warehouseNotes: raw.warehouseNotes,
    });
  }

  private createPackageLine() {
    return this.formBuilder.nonNullable.group({
      itemName: [''],
      pieceCount: [null as number | null],
      packageCount: [null as number | null],
      netWeightKg: [null as number | null],
      grossWeightKg: [null as number | null],
      lengthCm: [null as number | null],
      widthCm: [null as number | null],
      heightCm: [null as number | null],
      stackable: [true],
      fragile: [false],
      notes: [''],
    });
  }
}
