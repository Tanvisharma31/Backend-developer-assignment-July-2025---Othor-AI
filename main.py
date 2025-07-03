import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

sns.set(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

output_dir = 'wayne_analysis_output'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def load_financial_data():
    df = pd.read_csv('datasets/wayne_financial_data.csv')
    df['Date'] = df['Quarter'] + ' ' + df['Year'].astype(str)
    df['Date'] = pd.to_datetime(df['Date'].str.replace('Q', ''))
    return df

def load_hr_data():
    df = pd.read_csv('datasets/wayne_hr_analytics.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df
def load_rd_data():
    df = pd.read_csv('datasets/wayne_rd_portfolio.csv')
    df['Start_Date'] = pd.to_datetime(df['Start_Date'])
    return df
def load_security_data():
    df = pd.read_csv('datasets/wayne_security_data.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df
def load_supply_chain_data():
    df = pd.read_csv('datasets/wayne_supply_chain.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df

def plot_financial_metrics(df):
    plt.figure(figsize=(14, 8))
    plt.subplot(2, 2, 1)
    for division in df['Division'].unique():
        div_data = df[df['Division'] == division]
        plt.plot(div_data['Date'], div_data['Revenue_M'], 'o-', label=division)
    plt.title('Quarterly Revenue (Millions)')
    plt.xticks(rotation=45)
    plt.legend()
    plt.subplot(2, 2, 2)
    for division in df['Division'].unique():
        div_data = df[df['Division'] == division]
        plt.plot(div_data['Date'], div_data['Net_Profit_M'], 'o-', label=division)
    plt.title('Quarterly Net Profit (Millions)')
    plt.xticks(rotation=45)
    
    plt.subplot(2, 2, 3)
    for division in df['Division'].unique():
        div_data = df[df['Division'] == division]
        plt.plot(div_data['Date'], div_data['Market_Share_Pct'], 'o-', label=division)
    plt.title('Market Share (%)')
    plt.xticks(rotation=45)
    
    plt.subplot(2, 2, 4)
    for division in df['Division'].unique():
        div_data = df[df['Division'] == division]
        plt.plot(div_data['Date'], div_data['Employee_Count'], 'o-', label=division)
    plt.title('Employee Count')
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/financial_metrics.png')
    plt.close()

def analyze_hr_metrics(df):
    hr_summary = df.groupby(['Department', 'Employee_Level']).agg({
        'Retention_Rate_Pct': 'mean',
        'Training_Hours_Annual': 'mean',
        'Performance_Rating': 'mean',
        'Employee_Satisfaction_Score': 'mean'
    }).reset_index()
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=hr_summary, x='Department', y='Retention_Rate_Pct', hue='Employee_Level')
    plt.title('Average Retention Rate by Department and Employee Level')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/retention_rate.png')
    plt.close()
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df, x='Training_Hours_Annual', y='Performance_Rating', 
                   hue='Department', style='Employee_Level', s=100)
    plt.title('Training Hours vs Performance Rating')
    plt.tight_layout()
    plt.savefig(f'{output_dir}/training_vs_performance.png')
    plt.close()
    
    return hr_summary

def analyze_rd_portfolio(df):
    rd_summary = df.groupby(['Division', 'Status']).agg({
        'Budget_Allocated_M': 'sum',
        'Budget_Spent_M': 'sum',
        'Patent_Applications': 'sum',
        'Project_ID': 'count'
    }).reset_index()
    
    rd_summary = rd_summary.rename(columns={'Project_ID': 'Project_Count'})
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=rd_summary, x='Division', y='Budget_Allocated_M', hue='Status')
    plt.title('R&D Budget Allocation by Division and Status')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/rd_budget_allocation.png')
    plt.close()
    
    return rd_summary

def analyze_security_metrics(df):
    security_summary = df.groupby('District').agg({
        'Security_Incidents': 'mean',
        'Response_Time_Minutes': 'mean',
        'Public_Safety_Score': 'mean',
        'Crime_Prevention_Effectiveness_Pct': 'mean'
    }).reset_index()
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=security_summary, x='District', y='Security_Incidents')
    plt.title('Average Monthly Security Incidents by District')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/security_incidents.png')
    plt.close()
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=security_summary, x='Response_Time_Minutes', 
                   y='Public_Safety_Score', hue='District', s=100)
    plt.title('Response Time vs Public Safety Score')
    plt.tight_layout()
    plt.savefig(f'{output_dir}/response_vs_safety.png')
    plt.close()
    
    return security_summary

def analyze_supply_chain(df):
    sc_summary = df.groupby(['Facility_Location', 'Product_Line']).agg({
        'Monthly_Production_Volume': 'mean',
        'Cost_Per_Unit': 'mean',
        'Quality_Score_Pct': 'mean',
        'Lead_Time_Days': 'mean',
        'Carbon_Footprint_MT': 'mean'
    }).reset_index()
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=sc_summary, x='Facility_Location', y='Quality_Score_Pct', 
               hue='Product_Line')
    plt.title('Average Quality Score by Facility and Product Line')
    plt.xticks(rotation=45)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(f'{output_dir}/quality_scores.png')
    plt.close()
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=sc_summary, x='Cost_Per_Unit', y='Carbon_Footprint_MT',
                   hue='Product_Line', size='Monthly_Production_Volume', sizes=(50, 200))
    plt.title('Cost per Unit vs Carbon Footprint')
    plt.tight_layout()
    plt.savefig(f'{output_dir}/cost_vs_carbon.png')
    plt.close()
    
    return sc_summary

def generate_report(summaries):
    financial_df, hr_summary, rd_summary, security_summary, sc_summary = summaries
    
    report = "# Wayne Enterprises Business Analysis Report\n\n"
    
    report += "## 1. Financial Performance\n\n"
    report += "### Key Financial Metrics\n"
    for division in financial_df['Division'].unique():
        div_data = financial_df[financial_df['Division'] == division].iloc[-1]
        report += f"- **{division}**: "
        report += f"Revenue: ${div_data['Revenue_M']:.1f}M, "
        report += f"Net Profit: ${div_data['Net_Profit_M']:.1f}M, "
        report += f"Market Share: {div_data['Market_Share_Pct']:.1f}%\n"
    
    report += "\n## 2. Human Resources\n\n"
    report += "### Employee Retention and Performance\n"
    for dept in hr_summary['Department'].unique():
        dept_data = hr_summary[hr_summary['Department'] == dept]
        report += f"- **{dept}**: "
        report += f"Avg. Retention: {dept_data['Retention_Rate_Pct'].mean():.1f}%, "
        report += f"Avg. Performance: {dept_data['Performance_Rating'].mean():.1f}/10\n"
    
    report += "\n## 3. Research & Development\n\n"
    for division in rd_summary['Division'].unique():
        div_data = rd_summary[rd_summary['Division'] == division]
        report += f"### {division}\n"
        for _, row in div_data.iterrows():
            report += f"- **{row['Status']} Projects**: {row['Project_Count']} "
            report += f"(Budget: ${row['Budget_Allocated_M']:.1f}M, "
            report += f"Spent: ${row['Budget_Spent_M']:.1f}M, "
            report += f"Patents: {row['Patent_Applications']})\n"
    
    report += "\n## 4. Security Metrics\n\n"
    report += "### District-wise Security Performance\n"
    for _, row in security_summary.sort_values('Public_Safety_Score', ascending=False).iterrows():
        report += f"- **{row['District']}**: "
        report += f"Safety Score: {row['Public_Safety_Score']:.1f}/10, "
        report += f"Incidents: {row['Security_Incidents']:.1f}/month, "
        report += f"Response Time: {row['Response_Time_Minutes']:.1f} mins\n"
    
    report += "\n## 5. Supply Chain Performance\n\n"
    for location in sc_summary['Facility_Location'].unique():
        loc_data = sc_summary[sc_summary['Facility_Location'] == location]
        report += f"### {location}\n"
        for _, row in loc_data.iterrows():
            report += f"- **{row['Product_Line']}**: "
            report += f"Cost: ${row['Cost_Per_Unit']:.2f}, "
            report += f"Quality: {row['Quality_Score_Pct']:.1f}%, "
            report += f"Lead Time: {row['Lead_Time_Days']:.1f} days\n"
    
    report += "\n## 6. Key Recommendations\n\n"
    report += "1. **Financial Optimization**: Consider reallocating resources to divisions with higher profit margins.\n"
    report += "2. **Employee Development**: Increase training hours in departments with lower performance ratings.\n"
    report += "3. **R&D Focus**: Prioritize projects with high commercialization potential.\n"
    report += "4. **Security Enhancement**: Allocate more resources to districts with higher incident rates.\n"
    report += "5. **Supply Chain Improvement**: Work with vendors to reduce lead times and improve quality.\n"
    
    with open(f'{output_dir}/wayne_analysis_report.md', 'w') as f:
        f.write(report)

def main():
    print("Starting Wayne Enterprises Data Analysis...")
    
    try:
        print("Loading data...")
        financial_df = load_financial_data()
        hr_df = load_hr_data()
        rd_df = load_rd_data()
        security_df = load_security_data()
        sc_df = load_supply_chain_data()
        
        print("Generating financial analysis...")
        plot_financial_metrics(financial_df)
        
        print("Analyzing HR metrics...")
        hr_summary = analyze_hr_metrics(hr_df)
        
        print("Analyzing R&D portfolio...")
        rd_summary = analyze_rd_portfolio(rd_df)
        
        print("Analyzing security metrics...")
        security_summary = analyze_security_metrics(security_df)
        
        print("Analyzing supply chain...")
        sc_summary = analyze_supply_chain(sc_df)
        
        print("Generating final report...")
        generate_report((financial_df, hr_summary, rd_summary, security_summary, sc_summary))
        
        print(f"\nAnalysis complete! Results saved in the '{output_dir}' directory.")
        print("Files generated:")
        print(f"- {output_dir}/financial_metrics.png")
        print(f"- {output_dir}/retention_rate.png")
        print(f"- {output_dir}/training_vs_performance.png")
        print(f"- {output_dir}/rd_budget_allocation.png")
        print(f"- {output_dir}/security_incidents.png")
        print(f"- {output_dir}/response_vs_safety.png")
        print(f"- {output_dir}/quality_scores.png")
        print(f"- {output_dir}/cost_vs_carbon.png")
        print(f"- {output_dir}/wayne_analysis_report.md")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
