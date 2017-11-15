/**
 * Created by user on 2017/11/15/015.
 */

export interface IExpLvOptions
{
	desc?;

	lv_min?: number;
	lv_max?: number;
	force_max?: boolean;
}

export interface IExpLv
{
	desc?;

	lv_min: number;
	lv_max: number;
	force_max: boolean;

	options?: IExpLvOptions;

	exp(lv: number): number;
	lv(total_exp: number, overflow: boolean): number;

	exp_table(): IExpTable;
}

export interface IExpTable
{
	[key: number]: number;
	[key: string]: number;
}

export class ExpLv implements IExpLv
{
	public desc = `1400 + 600 * Current level\nhttps://wiki.guildwars.com/wiki/Experience`;
	public lv_min = 1;
	public lv_max = 20;
	public force_max = false;

	exp_table(): IExpTable
	{
		let t = {} as IExpTable;

		for (let lv = this.lv_min; lv <= this.lv_max; lv++)
		{
			t[lv] = this.exp(lv);
		}

		return t;
	}

	exp(lv: number): number
	{
		if (lv >= 23)
		{
			return 15000;
		}

		return 1400 + 600 * lv;
	}

	exp_next(lv: number): number
	{
		if (this.force_max && lv >= this.lv_max)
		{
			return 0;
		}

		return this.exp(lv);
	}

	exp_to(end: number, start = this.lv_min): number
	{
		let e2 = 0;

		for (let i = start; i < end; i++)
		{
			e2 += this.exp(i);
		}

		return e2;
	}

	lv(total_exp: number, overflow = false): number
	{
		let lv = this.lv_min;

		while ((total_exp -= this.exp(lv)) >= 0)
		{
			lv++;
			//console.log(lv, total_exp);
		}

		if (!overflow && lv >= this.lv_max)
		{
			return this.lv_max;
		}

		return lv;
	}

	lv_up(total_exp: number, lv = this.lv_min): number
	{
		let lv2 = this.lv(total_exp, true);

		if (this.force_max && lv2 >= this.lv_max)
		{
			lv2 = this.lv_max;
		}

		return lv2 - lv;
	}

}

export default ExpLv;

